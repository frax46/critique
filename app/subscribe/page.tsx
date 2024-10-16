'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-4xl w-full">
        {/* Decorative SVG shapes */}
        <svg className="absolute top-0 left-0 -mt-12 -ml-12 text-blue-500 opacity-50 h-24 w-24" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" />
        </svg>
        <svg className="absolute bottom-0 right-0 -mb-12 -mr-12 text-purple-500 opacity-50 h-24 w-24" fill="currentColor" viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" rx="20" />
        </svg>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">Choose Your Subscription</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {tiers.map((tier) => (
              <div key={tier.id} className="bg-blue-50 dark:bg-blue-900 rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-blue-800 dark:text-blue-300">{tier.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{tier.description}</p>
                  <p className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">£{tier.price}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Duration: {tier.duration} days</p>
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

          <div className="text-center">
            <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
