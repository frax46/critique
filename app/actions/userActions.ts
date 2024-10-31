'use server';

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const getUser = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const clerkUser = await clerkClient().users.getUser(userId);

  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
  });
  return user;
};

export const getUserSubscriptions = async () => {
  const user = await getUser();
  if (!user) return null;
  
  const subscriptions = await prisma.subscription.findMany({
    where: { 
      userId: user.id,
      expiresAt: {
        gt: new Date() // Only get subscriptions that haven't expired
      }
    }
  });
  return subscriptions;
};

export const getExpiredSubscriptions = async () => {
  const user = await getUser();
  if (!user) return null;
  
  const subscriptions = await prisma.subscription.findMany({
    where: { 
      userId: user.id,
      expiresAt: {
        lt: new Date() // Get subscriptions that have expired
      }
    },
    orderBy: {
      expiresAt: 'desc'
    }
  });
  return subscriptions;
};

export async function deleteSubscriptionAction(subscriptionId: string) {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');
  
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId }
  });
  
  if (!subscription || subscription.userId !== user.id) {
    throw new Error('Unauthorized');
  }
  
  await prisma.subscription.delete({
    where: { id: subscriptionId }
  });
  
  return true;
}

