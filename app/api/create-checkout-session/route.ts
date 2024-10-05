import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';




const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });

export async function POST(req: Request) {
  try {
    const { tierId } = await req.json();
    const tier = await prisma.subscriptionTier.findUnique({ where: { id: tierId } });
    

    if (!tier) {
      return NextResponse.json({ error: 'Tier not found' }, { status: 404 });
    }

    if (!tier.stripePriceId) {
      return NextResponse.json({ error: 'Stripe Price ID not found for this tier' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: tier.stripePriceId.toString(),
          quantity: 1,
        },
      ],
      metadata: {
        tier: tier.id,
        duration: tier.duration
      },
      mode: tier.duration >1 ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
    });

    console.log(session.metadata)
    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}