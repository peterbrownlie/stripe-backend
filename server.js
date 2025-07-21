const express = require("express");
const app = express();
const stripe = require("stripe")("sk_test_51RnEslFaauKAsVP9DJj0TL7p2PvHicGMPfDMWzpkgeyR90fBuP2werTG9ZKG6olsSYqNS3dOkqDVLFlbe4hWE7zN00BLQC5f2D"); // Replace with your Stripe secret key
const cors = require("cors");

app.use(cors());
app.use(express.json());

const YOUR_DOMAIN = "https://peterbrownlie.github.io/Calne-RFC-Kit-Order-Form";

app.post("/create-checkout-session", async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid payment amount" });
  }

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
      success_url: `${YOUR_DOMAIN}/TEST.html?payment=success`,
      cancel_url: `${YOUR_DOMAIN}/TEST.html?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Payment failed to initiate." });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
