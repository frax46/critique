'use client';

import { useState } from 'react';
import { deleteSubscriptionAction } from '../actions/userActions';
import { useRouter } from 'next/navigation';

interface DeleteSubscriptionButtonProps {
  subscriptionId: string;
}

export default function DeleteSubscriptionButton({ subscriptionId }: DeleteSubscriptionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSubscriptionAction(subscriptionId);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete subscription:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 
                 font-medium px-4 py-2 rounded-lg transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-red-50 dark:hover:bg-red-900/20"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
} 