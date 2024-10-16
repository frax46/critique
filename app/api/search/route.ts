import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { postcode, address } = await request.json();

  // Normalize the postcode: remove spaces and convert to uppercase
  const normalizedPostcode = postcode.replace(/\s+/g, '').toUpperCase();

  try {
    const properties = await prisma.property.findMany({
      where: {
        postcode: {
          equals: normalizedPostcode,
          mode: 'insensitive', // This makes the search case-insensitive
        },
        ...(address && {
          address: {
            contains: address,
            mode: 'insensitive',
          },
        }),
      },
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error searching for properties:', error);
    return NextResponse.json({ error: 'An error occurred while searching for properties' }, { status: 500 });
  }
}
