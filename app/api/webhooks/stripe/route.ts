import { PrismaClient } from '@prisma/client';
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!
const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
    } catch (err) {
        console.log('webhook signature verification failed', err)
        return new Response('Webhook Error', { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        
        const session = event.data.object as Stripe.Checkout.Session
        const costumerDetails = session.customer_details
        
        
        if (costumerDetails?.email) {
           const user = await prisma.user.findUnique({
            where: {
                email: costumerDetails.email
            }
           })
           if(user && session.metadata){
                const duration = parseInt(session.metadata.duration);
                const currentDate = new Date();
                const expirationDate = new Date(currentDate.getTime() + duration * 24 * 60 * 60 * 1000);
                
                await prisma.subscription.create({
                    data: {
                        userId: user?.id,
                        tier: parseInt(session.metadata.tier),
                        expiresAt: expirationDate
                    }
                });
            }
                
         
        }

   } return new Response('Webhook processed', { status: 200 })
}
