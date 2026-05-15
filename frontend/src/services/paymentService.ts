import axios from "axios";
 
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
 
export const createOrder = async (amount: number) => {
 
  const response = await axios.post(
    `${API_URL}/payment/create-order`,
    {
      amount,
    }
  );
 
  return response.data;
};
 
export const verifyPayment = async (paymentData: any) => {
 
  const response = await axios.post(
    `${API_URL}/payment/verify-payment`,
    paymentData
  );
 
  return response.data;
};
 