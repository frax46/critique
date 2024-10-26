import { PrismaClient } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.log("webhook signature verification failed", err);
    return new Response("Webhook Error", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const costumerDetails = session.customer_details;
      console.log("costumerDetails", costumerDetails);
      console.log("session", session);

      if (costumerDetails?.email) {
        const user = await prisma.user.findUnique({
          where: {
            email: costumerDetails.email,
          },
        });
        if (user && session.metadata) {
          const duration = parseInt(session.metadata.duration);
          const currentDate = new Date();
          const expirationDate = new Date(
            currentDate.getTime() + duration * 24 * 60 * 60 * 1000
          );

          await prisma.subscription.create({
            data: {
              userId: user?.id,
              tier: parseInt(session.metadata.tier),
              stripeCustomerId: session.customer as string,
              expiresAt: expirationDate,
            },
          });
        }
      }
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      
      const customerId = subscription.customer;
      const usersubId = await prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId as string },
      });
     
      if (usersubId) {
        const userId = usersubId.userId;
         console.log("usersubId", userId);
        const sub =await prisma.subscription.findFirst({
          where: { userId: userId},
         
        });
         sub!.expiresAt = new Date(subscription.current_period_end * 1000) 
         
         await prisma.subscription.update({
           where: { id: sub!.id },
           data: { expiresAt: sub!.expiresAt }
         });
      }

    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("deleted subscription", subscription);
      // subscription.customer
      const userId = subscription.metadata.userId;
      if (userId) {
        await prisma.subscription.delete({
          where: { id: userId },
        });
      }
    }
    default: {
      console.log("Unhandled event type", event.type);
    }
  }
  // if (event.type === "checkout.session.completed") {

  // }

  return new Response("Webhook processed", { status: 200 });
}
