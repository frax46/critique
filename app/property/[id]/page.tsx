import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PropertyDetails } from '@/components/property/PropertyDetails';
import { StartReviewButton } from '@/components/StartReviewButton';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getPropertyWithUsers(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      answers: {
        select: {
          userId: true,
          rating: true,
          user: {
            select: {
              name: true
            }
          }
        },
        distinct: ['userId'],
      },
    },
  });
  return property;
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getPropertyWithUsers(params.id);

  if (!property) {
    return <div>Property not found</div>;
  }

  // Calculate the average rating for the property
  const averageRating = property.answers.length > 0
    ? property.answers.reduce((sum, answer) => sum + answer.rating, 0) / property.answers.length
    : 0;

  return (
    <div className="container mx-auto p-4 md:mt-28">
      <PropertyDetails property={{
        id: property.id,
        address: property.address,
        postcode: property.postcode,
        houseNumber: property.houseNumber,
        averageRating: averageRating,
        answers: property.answers
      }} />
      <div className="mt-4">
        <StartReviewButton 
          propertyId={property.id} 
          propertyAddress={`${property.address}, ${property.postcode}, ${property.houseNumber}`} 
        />
      </div>
      <div className="border-t border-gray-200 my-6"></div>
      <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {property.answers.map((answer) => (
          <Link href={`/property/${property.id}/user/${answer.userId}`} key={answer.userId}>
            <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
              <p className="font-semibold">User Review by {answer.user.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-600 mt-2">Click to view details</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}