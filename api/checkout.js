import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { items } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map(i => ({
      price_data: {
        currency: 'usd',
        product_data: { name: i.name },
        unit_amount: i.price,
      },
      quantity: i.quantity,
    })),
    success_url: `${process.env.DOMAIN}/success`,
    cancel_url: `${process.env.DOMAIN}/?canceled=true`,
  });
  
  res.json({ url: session.url });
};
