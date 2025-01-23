// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CREATE_ORDER } from "../utils/constants";
import { useRouter } from "next/router";

function Checkout() {
  const router = useRouter();
  const { gigId } = router.query;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initiatePayment = async () => {
      if (!gigId) return;
      
      setIsLoading(true);
      setError("");
      
      try {
        const { data } = await axios.post(
          CREATE_ORDER,
          { gigId },
          { withCredentials: true }
        );
        
        console.log('Payment response:', data);
        
        if (data?.GatewayPageURL) {
          window.location.href = data.GatewayPageURL;
        } else {
          console.error('Invalid payment response:', data);
          setError("Could not initialize payment. Please try again.");
        }
      } catch (error) {
        console.error("Payment initiation failed:", error);
        setError(error.response?.data || "Payment initiation failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    initiatePayment();
  }, [gigId]);

  if (error) {
    return (
      <div className="min-h-[80vh] max-w-full mx-20 flex flex-col gap-10 items-center justify-center">
        <h1 className="text-3xl text-red-500">
          {error}
        </h1>
        <button 
          onClick={() => router.back()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] max-w-full mx-20 flex flex-col gap-10 items-center justify-center">
      <h1 className="text-3xl">
        {isLoading ? "Initializing payment..." : "Redirecting to payment gateway..."}
      </h1>
      {isLoading && (
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  );
}

export default Checkout;
