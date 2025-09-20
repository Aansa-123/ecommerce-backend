import express from "express";
import qs from "qs";
import Order from "../models/Order.js"; // adjust path to your Order model

const router = express.Router();

const {
  PAYFAST_MERCHANT_ID,
  PAYFAST_MERCHANT_KEY,
  PAYFAST_RETURN_URL,
  PAYFAST_CANCEL_URL,
  PAYFAST_NOTIFY_URL,
} = process.env;

const PAYFAST_BASE_URL = "https://sandbox.payfast.co.za/eng/process";

// ✅ Step 1: Generate PayFast Payment URL
router.post("/pay", async (req, res) => {
  try {
    const { amount, item_name, orderId } = req.body;

    // Validate amount and format to 2 decimals as string
    const amt = Number(amount);
    if (!amt || isNaN(amt) || amt <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    const formattedAmount = amt.toFixed(2);

    // Ensure item_name present and reasonable
    const name = (item_name && String(item_name).slice(0, 100)) || "Order Payment";

    const paymentData = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: PAYFAST_RETURN_URL,
      cancel_url: PAYFAST_CANCEL_URL,
      notify_url: PAYFAST_NOTIFY_URL,
      amount: formattedAmount,     // formatted
      item_name: name,             // ensured
      custom_str1: orderId || "",  // optional
    };

    const paymentUrl = `${PAYFAST_BASE_URL}?${qs.stringify(paymentData)}`;
    return res.json({ paymentUrl });
  } catch (error) {
    console.error("PayFast Error:", error);
    return res.status(500).json({ error: "Payment initialization failed" });
  }
});

// ✅ Step 2: PayFast Notify
// For your flow, keep order in 'Pending' after successful payment.
router.post("/notify", async (req, res) => {
  try {
    console.log("PayFast notify:", req.body);

    // Get orderId from PayFast custom_str1
    const orderId = req.body.custom_str1;

    if (!orderId) {
      return res.status(400).send("Missing orderId");
    }

    // Keep status as 'Pending' to match COD flow
    await Order.findByIdAndUpdate(orderId, { status: "Pending" });

    console.log(`✅ Order ${orderId} marked as Pending`);

    // Respond OK to PayFast
    res.status(200).send("OK");
  } catch (error) {
    console.error("Notify error:", error);
    res.status(500).send("Notify handler failed");
  }
});

export default router;
