import React from 'react';
import { PrismaClient } from '@prisma/client';
import { ReviewForm } from './ReviewForm';

const prisma = new PrismaClient();

async function getPropertyAddress(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    select: { address: true, postcode: true},
  });
  return property;
}

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const property = await getPropertyAddress(params.id);

  if (!property) {
    return <div>Property not found</div>;
  }

  const initialAddress = property.address;

  return (
    <div className="container mx-auto p-4 md:mt-28">
      <h1 className="text-3xl font-bold mb-6">Write a Review</h1>
      <ReviewForm propertyId={params.id} initialAddress={initialAddress} postcode={property.postcode} />
    </div>
  );
}