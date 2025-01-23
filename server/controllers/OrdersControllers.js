import { PrismaClient } from "@prisma/client";
import SSLCommerzPayment from 'sslcommerz-lts';

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = false;

export const createOrder = async (req, res, next) => {
  try {
    if (req.body.gigId) {
      const { gigId } = req.body;
      const prisma = new PrismaClient();
      const gig = await prisma.gigs.findUnique({
        where: { id: parseInt(gigId) },
        include: { createdBy: true }
      });

      if (!gig) {
        return res.status(404).send("Gig not found");
      }

      const tran_id = `${Date.now()}`;
      
      // Create order in database first
      const order = await prisma.orders.create({
        data: {
          paymentIntent: tran_id,
          price: gig.price,
          buyer: { connect: { id: req?.userId } },
          gig: { connect: { id: gig.id } },
        },
        include: { buyer: true }
      });

      const data = {
        store_id: store_id,
        store_passwd: store_passwd,
        total_amount: gig.price,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${process.env.CLIENT_URL}/success?payment_intent=${tran_id}`,
        fail_url: `${process.env.CLIENT_URL}/failed?payment_intent=${tran_id}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel?payment_intent=${tran_id}`,
        ipn_url: `${process.env.SERVER_URL}/api/orders/ipn`,
        shipping_method: 'NO',
        product_name: gig.title,
        product_category: 'Service',
        product_profile: 'non-physical-goods',
        cus_name: order.buyer?.email?.split('@')[0] || 'Customer',
        cus_email: order.buyer?.email || 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        ship_name: order.buyer?.email?.split('@')[0] || 'Customer',
        ship_add1: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
      };

      console.log('Initiating SSLCommerz payment with data:', data);

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      try {
        const apiResponse = await sslcz.init(data);
        console.log('SSLCommerz API Response:', apiResponse);

        if (apiResponse?.GatewayPageURL) {
          return res.json({
            GatewayPageURL: apiResponse.GatewayPageURL
          });
        } else {
          console.error('SSLCommerz Error - No Gateway URL:', apiResponse);
          throw new Error('No Gateway URL received');
        }
      } catch (sslError) {
        console.error('SSLCommerz Error:', sslError);
        // Delete the order since payment initialization failed
        await prisma.orders.delete({
          where: { id: order.id }
        });
        return res.status(500).send("Payment initialization failed");
      }
    } else {
      return res.status(400).send("Gig id is required.");
    }
  } catch (err) {
    console.error('Error in createOrder:', err);
    return res.status(500).send("Internal Server Error");
  }
};

export const confirmOrder = async (req, res, next) => {
  try {
    if (req.body.paymentIntent) {
      const prisma = new PrismaClient();
      await prisma.orders.update({
        where: { paymentIntent: req.body.paymentIntent },
        data: { isCompleted: true },
      });
      return res.status(200).send("Order confirmed successfully");
    }
    return res.status(400).send("Payment intent is required");
  } catch (err) {
    console.error('Error in confirmOrder:', err);
    return res.status(500).send("Internal Server Error");
  }
};

export const handleIPN = async (req, res) => {
  try {
    console.log('IPN Request Body:', req.body);
    const { status, tran_id, val_id } = req.body;
    
    if (!tran_id) {
      return res.status(400).send("Transaction ID is required");
    }

    const prisma = new PrismaClient();
    const order = await prisma.orders.findUnique({
      where: { paymentIntent: tran_id }
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    if (status === 'VALID' || status === 'VALIDATED') {
      await prisma.orders.update({
        where: { paymentIntent: tran_id },
        data: { 
          isCompleted: true,
          paymentValidationId: val_id || null
        },
      });
      console.log('Order marked as completed:', tran_id);
    }
    
    return res.status(200).send("IPN Handled");
  } catch (err) {
    console.error('Error in IPN Handler:', err);
    return res.status(500).send("IPN Handler Error");
  }
};

export const getBuyerOrders = async (req, res, next) => {
  try {
    if (req.userId) {
      const prisma = new PrismaClient();
      const orders = await prisma.orders.findMany({
        where: { buyerId: req.userId, isCompleted: true },
        include: { gig: true },
      });
      return res.status(200).json({ orders });
    }
    return res.status(400).send("User id is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    if (req.userId) {
      const prisma = new PrismaClient();
      const orders = await prisma.orders.findMany({
        where: {
          gig: {
            createdBy: {
              id: parseInt(req.userId),
            },
          },
          isCompleted: true,
        },
        include: {
          gig: true,
          buyer: true,
        },
      });
      return res.status(200).json({ orders });
    }
    return res.status(400).send("User id is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};
