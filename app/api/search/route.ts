import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { postcode,address } = await request.json();

  try {
    const properties = await prisma.property.findMany({
      where: {
        AND: [
          { postcode: { equals: postcode, mode: 'insensitive' } },
          address ? { address: { contains: address, mode: 'insensitive' } } : {}
        ]
      },
    });

    if (properties.length > 0) {
      return NextResponse.json({ found: true, properties });
    } else {
      return NextResponse.json({ found: false });
    }
  } catch (error) {
    console.error('Error searching for properties:', error);
    return NextResponse.json({ error: 'An error occurred while searching for properties' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}