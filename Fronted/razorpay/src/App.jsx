import { useState } from "react";

function App() {
  const [amount, setAmount] = useState(500);

  const payNow = async () => {
    const order = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then((res) => res.json());

    const options = {
      key: "rzp_test_Rmcxri4JBDSGKN",
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: "Clinic Test Payment",
      description: "Test Transaction",
      handler: async function (response) {
        // verify on backend
        const verify = await fetch("http://localhost:5000/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        }).then((res) => res.json());

        if (verify.success) alert("Payment Success!");
        else alert("Payment Verification Failed!");
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Razorpay Test Payment</h1>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: 10, marginRight: 10 }}
      />

      <button onClick={payNow} style={{ padding: "10px 20px" }}>
        Pay Now
      </button>
    </div>
  );
}

export default App;
