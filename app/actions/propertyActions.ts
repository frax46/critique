'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPropertyWithUsers(id: string) {
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

export async function getUserSubscriptionStatus(userId: string | null) {
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

    return !!subscription;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
}

export async function addReview(propertyId: string, reviewData: any) {
  try {
    const newReview = await prisma.answer.create({
      data: {
        ...reviewData,
        propertyId,
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });
    return newReview;
  } catch (error) {
    console.error("Error adding new review:", error);
    throw error;
  }
}