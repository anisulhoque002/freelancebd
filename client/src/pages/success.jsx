import { ORDER_SUCCESS_ROUTE } from "../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function Success() {
  const router = useRouter();
  const { payment_intent } = router.query;

  useEffect(() => {
    const changeOrderStatus = async () => {
      try {
        if (payment_intent) {
          await axios.put(
            ORDER_SUCCESS_ROUTE,
            { paymentIntent: payment_intent },
            { withCredentials: true }
          );
          setTimeout(() => router.push("/buyer/orders"), 5000);
        }
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };
    
    changeOrderStatus();
  }, [payment_intent, router]);

  return (
    <div className="h-[80vh] flex items-center px-20 pt-20 flex-col">
      <h1 className="text-4xl text-center text-green-500">
        Payment successful! You are being redirected to the orders page.
      </h1>
      <h1 className="text-4xl text-center">Please do not close the page.</h1>
    </div>
  );
}

export default Success;
