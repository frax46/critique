'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ReviewLinkProps {
  hasActiveSubscription: boolean;
  propertyId: string;
  userId: string;
  userName: string;
}

export const ReviewLink: React.FC<ReviewLinkProps> = ({
  hasActiveSubscription,
  propertyId,
  userId,
  userName,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!hasActiveSubscription) {
      e.preventDefault();
      toast.error("Choose one of our plans to view the detailed user review", {
        duration: 3000,
        position: 'bottom-center',
      });
      router.push('/subscribe');
    }
  };

  return (
    <Link href={`/property/${propertyId}/user/${userId}`} onClick={handleClick}>
      <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
        <p className="font-semibold">User Review by {userName}</p>
        <p className="text-sm text-gray-600 mt-2">
          {hasActiveSubscription ? 'Click to view details' : 'Subscribe to view details'}
        </p>
      </div>
    </Link>
  );
};