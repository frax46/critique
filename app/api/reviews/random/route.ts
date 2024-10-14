import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const randomReviews = await prisma.answer.findMany({
      where: {
        rating: {
          gte: 4 // Only fetch reviews with a rating of 4 or higher
        }
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        question: {
          select: {
            text: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

    return NextResponse.json(randomReviews);
  } catch (error) {
    console.error('Error fetching random reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
