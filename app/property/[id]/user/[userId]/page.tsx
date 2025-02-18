import React from 'react';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getUserAnswersForProperty(propertyId: string, userId: string) {
  const answers = await prisma.answer.findMany({
    where: {
      propertyId: propertyId,
      userId: userId,
    },
    include: {
      user: true,
      question: true,
    },
    orderBy: {
      id: 'desc', // Using 'id' as a proxy for 'createdAt' since it's not in the schema
    },
  });
  return answers;
}

export default async function UserPropertyReviewsPage({ params }: { params: { id: string; userId: string } }) {
  const answers = await getUserAnswersForProperty(params.id, params.userId);

  if (answers.length === 0) {
    return <div>No reviews found for this user on this property</div>;
  }

  const user = answers[0].user;

  return (
    <div className="container mx-auto p-4 md:mt-28">
      <Link href={`/property/${params.id}`} className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Property
      </Link>
      <h1 className="text-3xl font-bold mb-6">Reviews by {user.name}</h1>
      <div className="space-y-6">
        {answers.map((answer) => (
          <div key={answer.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{answer.question.text}</h2>
            <p className="text-gray-700 mb-4">{answer.text}</p>
            <div className="flex items-center">
              <span className="mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= answer.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Reviewed on {new Date(answer.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}