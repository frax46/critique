'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface StartReviewButtonProps {
  propertyId?: string;
  propertyAddress?: string;
  className?: string;
  onClick?: () => void;
}

export function StartReviewButton({ propertyId, propertyAddress, className = '', onClick }: StartReviewButtonProps) {
  const router = useRouter();

  const handleStartReview = () => {
    if (onClick) {
      onClick();
    } else if (propertyId) {
      router.push(`/property/${propertyId}/review${propertyAddress ? `?address=${encodeURIComponent(propertyAddress)}` : ''}`);
    } else {
      router.push('/search?mode=review');
    }
  };

  return (
    <Button
      onClick={handleStartReview}
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ${className}`}
    >
      Start a Review
    </Button>
  );
}