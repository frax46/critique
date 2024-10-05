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
           if(user){
           await prisma.subscription.create({
            data: {
                    userId: user?.id,
                    tier: 1,
                    
                    expiresAt: new Date(Date.now() + (session.expires_at || 0) * 1000)
                }
            })
        }
                
         
    }

   } return new Response('Webhook processed', { status: 200 })
}
