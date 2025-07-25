const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

app.use(cors());
app.use(express.json());

const YOUR_DOMAIN = "https://peterbrownlie.github.io/Calne-RFC-Kit-Order-Form";

app.post("/create-checkout-session", async (req, res) => {
  const rawAmount = req.body.amount;

  if (!rawAmount || rawAmount <= 0) {
    return res.status(400).json({ error: "Invalid payment amount" });
  }

  const amount = Math.round(rawAmount * 100); // convert to pence

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Calne RFC Kit Order",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${YOUR_DOMAIN}/Order-Form.html?payment=success`,
      cancel_url: `${YOUR_DOMAIN}/Order-Form.html?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Payment failed to initiate." });
  }
});


const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
