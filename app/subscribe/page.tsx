'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function SubscribePage() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);

  useEffect(() => {
    const fetchTiers = async () => {
      const response = await axios.get('/api/subscription-tiers');
      setTiers(response.data);
    };
    fetchTiers();
  }, []);

  const handleSubscribe = async (tierId: string) => {
    const stripe = await stripePromise;
    const response = await axios.post(`/api/create-checkout-session`, { tierId });
    const session = response.data;
    
    const result = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <main className="min-h-screen w-full bg-blue-50">
      {/* Hero Section */}
      <section className="relative h-64 w-full flex flex-col items-center justify-center mb-12">
        <Image
          src="/background.png"
          alt="Subscribe background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Subscription
          </h1>
        </div>
      </section>

      {/* Subscription Tiers Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div key={tier.id} className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-blue-800">{tier.name}</h2>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  <p className="text-3xl font-bold mb-4 text-blue-600">£{tier.price}</p>
                  <p className="text-gray-600 mb-6">Duration: {tier.duration} days</p>
                  <button
                    onClick={() => handleSubscribe(tier.id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to unlock premium features?</h2>
          <p className="text-xl mb-8">Choose a plan that suits your needs and start enjoying exclusive benefits today.</p>
        </div>
      </section>
    </main>
  );
}
