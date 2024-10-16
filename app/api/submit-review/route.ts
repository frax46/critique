import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as z from 'zod';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

const reviewSchema = z.object({
  address: z.string().min(1),
  postcode: z.string().min(1),
  answers: z.array(z.object({
    questionId: z.string(),
    rating: z.number().min(1).max(5),
    text: z.string().min(1),
  })),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure user exists in our database
    const user = await prisma.user.upsert({
      where: { email: clerkUser.emailAddresses[0].emailAddress },
      update: {},
      create: {
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName || ''}`,
      },
    });

    const body = await req.json();
    const { address, postcode, answers } = reviewSchema.parse(body);

    // Check if the property already exists
    let property = await prisma.property.findFirst({
      where: {
        address,
        postcode,
    
      },
    });

    // If the property doesn't exist, create it
    if (!property) {
      property = await prisma.property.create({
        data: {
          address,
          postcode: postcode.replace(/\s/g, ''), // Remove all spaces from postcode
        
          userId: user.id,
        },
      });
    }

    // Save the answers
    const savedAnswers = await Promise.all(
      answers.map((answer) =>
        prisma.answer.create({
          data: {
            text: answer.text,
            rating: answer.rating,
            userId: user.id,
            questionId: answer.questionId,
            propertyId: property.id,
          },
        })
      )
    );

    return NextResponse.json({ success: true, property, answers: savedAnswers }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}