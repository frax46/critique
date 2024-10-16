import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = await prisma.property.findMany({
    where: {
      OR: [
        { address: { contains: query, mode: 'insensitive' } },
        
      ],
    },
    select: {
      address: true,
      
      postcode: true,
    },
    take: 5,
  });

  const formattedSuggestions = suggestions.map(
    (s) => `${s.address}`
  );

  return NextResponse.json({ suggestions: formattedSuggestions });
}
