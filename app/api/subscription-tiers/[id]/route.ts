import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  console.log('Received params:', params);
  console.log('Received id:', params.id);

  if (!params.id) {
    console.log('Missing id parameter');
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  try {
    const data = await req.json();
    console.log('Received data:', data);

    const updatedTier = await prisma.subscriptionTier.update({
      where: { id: params.id },
      data: {
        ...data,
        id: undefined
      }
     
    });
    console.log('Updated tier:', updatedTier);
    return NextResponse.json(updatedTier);
  } catch (error) {
    console.error('Error updating tier:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  console.log('Received params:', params); // Add this line for debugging
  if (!params.id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }
  try {
    await prisma.subscriptionTier.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Tier deleted successfully' });
  } catch (error) {
    console.error('Error deleting tier:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}