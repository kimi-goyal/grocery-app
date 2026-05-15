import { createOrder, verifyPayment } from "../../services/paymentService";
 
const RazorpayButton = ({ amount, onSuccess }: { amount: number; onSuccess?: () => void }) => {
 
  const handlePayment = async () => {
 
    try {
      if (!amount || amount <= 0) {
        alert("Add items to your cart before payment.");
        return;
      }
 
      // Create order from backend
      const order = await createOrder(amount);
 
      const options = {
 
        key: order.key,
 
        amount: order.amount,
 
        currency: order.currency,
 
        name: "FreshCart",
 
        description: "Grocery Order Payment",
 
        order_id: order.order_id,
 
        handler: async function (response: any) {
 
          try {
 
            const verification = await verifyPayment({
 
              razorpay_order_id:
                response.razorpay_order_id,
 
              razorpay_payment_id:
                response.razorpay_payment_id,
 
              razorpay_signature:
                response.razorpay_signature,
            });
 
            if (verification.success) {
              alert("Payment Successful");
              console.log(response);
              onSuccess?.();
            }
 
          } catch (error) {
 
            console.log(error);
 
            alert("Payment Verification Failed");
          }
        },
 
        prefill: {
 
          name: "Vidisha",
 
          email: "vidisha@example.com",
 
          contact: "9999999999",
        },
 
        notes: {
 
          address: "FreshCart Grocery Store",
        },
 
        theme: {
 
          color: "#10b981",
        },
      };
 
      const razorpay = new window.Razorpay(options);
 
      razorpay.open();
 
    } catch (error) {
 
      console.log(error);
 
      alert("Payment Failed");
    }
  };
 
  return (
 
    <button
      onClick={handlePayment}
      className="bg-green-500 text-white px-6 py-3 rounded-lg"
    >
      Pay Now
    </button>
  );
};
 
export default RazorpayButton;