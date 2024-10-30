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

