import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { address } = await request.json();

  try {
    const property = await prisma.property.findFirst({
      where: {
        address: {
          contains: address,
          mode: 'insensitive',
        },
      },
    });

    if (property) {
      return NextResponse.json({ found: true, property });
    } else {
      return NextResponse.json({ found: false });
    }
  } catch (error) {
    console.error('Error searching for property:', error);
    return NextResponse.json({ error: 'An error occurred while searching for the property' }, { status: 500 });
  }
}