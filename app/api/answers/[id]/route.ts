import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;
  const { text } = await req.json();

  try {
    const answer = await prisma.answer.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!answer || answer.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id },
      data: { text },
    });

    return NextResponse.json(updatedAnswer);
  } catch (error) {
    console.error("Error updating answer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;

  try {
    const answer = await prisma.answer.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!answer || answer.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.answer.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
