'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  stripePriceId?: string;
}

export default function AdminSubscriptionTiers() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [newTier, setNewTier] = useState<Omit<SubscriptionTier, 'id'>>({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    stripePriceId: '',
  });
  const [editingTier, setEditingTier] = useState<string | null>(null);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    const response = await axios.get('/api/subscription-tiers');
    setTiers(response.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTier(prev => ({ ...prev, [name]: name === 'price' || name === 'duration' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/subscription-tiers', newTier);
      setNewTier({ name: '', description: '', price: 0, duration: 30, stripePriceId: '' });
      fetchTiers();
    } catch (error) {
      console.error('Failed to create tier:', error);
    }
  };

  const handleUpdate = async (tier: SubscriptionTier) => {
    try {
      console.log('Updating tier:', tier);
      const response = await axios.put(`/api/subscription-tiers/${tier.id}`, tier);
      console.log('Update response:', response.data);
      setEditingTier(null);
      fetchTiers();
    } catch (error) {
      console.error('Failed to update tier:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tier?')) {
      try {
        await axios.delete(`/api/subscription-tiers/${id}`);
        fetchTiers();
      } catch (error) {
        console.error('Failed to delete tier:', error);
      }
    }
  };

  return (
    <div className="p-8 pt-24 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Subscription Tiers</h1>
      
      <form onSubmit={handleSubmit} className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={newTier.name}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price (£)
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={newTier.price}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (days)
            </label>
            <input
              id="duration"
              type="number"
              name="duration"
              value={newTier.duration}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="stripePriceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stripe Price ID (optional)
            </label>
            <input
              id="stripePriceId"
              type="text"
              name="stripePriceId"
              value={newTier.stripePriceId}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newTier.description}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Tier
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tiers.map(tier => (
          <div key={tier.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
            {editingTier === tier.id ? (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdate(tier); }}>
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) => setTiers(tiers.map(t => t.id === tier.id ? { ...t, name: e.target.value } : t))}
                  className="text-2xl font-semibold mb-3 w-full border rounded px-2 py-1"
                />
                <textarea
                  value={tier.description}
                  onChange={(e) => setTiers(tiers.map(t => t.id === tier.id ? { ...t, description: e.target.value } : t))}
                  className="text-gray-600 dark:text-gray-300 mb-4 w-full border rounded px-2 py-1"
                />
                <div className="flex items-center mb-3">
                  <label className="mr-3">Duration (days):</label>
                  <input
                    type="number"
                    value={tier.duration}
                    onChange={(e) => setTiers(tiers.map(t => t.id === tier.id ? { ...t, duration: parseInt(e.target.value) } : t))}
                    className="border rounded px-2 py-1 w-20"
                  />
                </div>
                <div className="flex items-center mb-3">
                  <label className="mr-3">Price (£):</label>
                  <input
                    type="number"
                    value={tier.price}
                    onChange={(e) => setTiers(tiers.map(t => t.id === tier.id ? { ...t, price: parseFloat(e.target.value) } : t))}
                    className="border rounded px-2 py-1 w-20"
                  />
                </div>
                <div className="flex items-center mb-3">
                  <label className="mr-3">Stripe Price ID:</label>
                  <input
                    type="text"
                    value={tier.stripePriceId || ''}
                    onChange={(e) => setTiers(tiers.map(t => t.id === tier.id ? { ...t, stripePriceId: e.target.value } : t))}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                  <button type="button" onClick={() => setEditingTier(null)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-3">{tier.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tier.description}</p>
                <p className="mb-3">Duration: {tier.duration} days</p>
                <p className="mb-3">Price: £{tier.price}</p>
                <p className="mb-3">Stripe Price ID: {tier.stripePriceId || 'Not set'}</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setEditingTier(tier.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                  <button onClick={() => handleDelete(tier.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}