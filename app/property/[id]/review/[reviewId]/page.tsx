import React from 'react';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getReviewDetails(reviewId: string) {
  const review = await prisma.answer.findUnique({
    where: { id: reviewId },
    include: {
      user: true,
      question: true,
      property: true,
    },
  });
  return review;
}

export default async function ReviewPage({ params }: { params: { id: string, reviewId: string } }) {
  const review = await getReviewDetails(params.reviewId);

  if (!review) {
    return <div>Review not found</div>;
  }

  return (
    <div className="container mx-auto p-4 md:mt-28"> {/* Added mt-16 for top margin */}
      <Link href={`/property/${params.id}`} className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Property
      </Link>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Review Details</h1>
        <p className="font-semibold">{review.user.name}</p>
        <p className="text-gray-600 mb-2">{review.question.text}</p>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-gray-700">{review.text}</p>
      </div>
    </div>
  );
}