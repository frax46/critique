'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-8 pt-20 flex items-center justify-center relative overflow-hidden">
      {/* Decorative SVG pattern */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.1)" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
      </svg>

      <div className="max-w-6xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Choose Your Subscription</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div key={tier.id} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 flex flex-col">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">{tier.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tier.description}</p>
                <p className="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400">£{tier.price}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Duration: {tier.duration} days</p>
                <button
                  onClick={() => handleSubscribe(tier.id)}
                  className="mt-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated floating shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              backgroundColor: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'][i],
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
