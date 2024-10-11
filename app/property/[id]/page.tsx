import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PropertyDetails } from '@/components/property/PropertyDetails';
import { StartReviewButton } from '@/components/StartReviewButton';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ReviewLink } from '@/app/components/property/ReviewLink';

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

async function getUserSubscriptionStatus(userId: string | null) {
  if (!userId) return false;
  
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (subscription) {
      console.log("Found subscription:", subscription);
      return true;
    } else {
      console.log("No active subscription found for user:", userId);
      return false;
    }
  } catch (error) {
    console.error("Error checking subscription status:", error);
    // If there's an error (including invalid ObjectID), assume no active subscription
    return false;
  }
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  
  let property;
  let hasActiveSubscription = false;

  try {
    property = await getPropertyWithUsers(params.id);
    if (user) {
      const dbUser = await prisma.user.findUnique({ where: { email: user.emailAddresses[0].emailAddress } })
      hasActiveSubscription = await getUserSubscriptionStatus(dbUser?.id || null);
    }
  } catch (error) {
    console.error("Error fetching property or subscription status:", error);
    return <div>Error loading property information</div>;
  }

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
          <ReviewLink
            key={answer.userId}
            hasActiveSubscription={hasActiveSubscription}
            propertyId={property.id}
            userId={answer.userId}
            userName={answer.user.name || 'Anonymous'}
          />
        ))}
      </div>
    </div>
  );
}