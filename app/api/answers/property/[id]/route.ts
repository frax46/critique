import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser } from "@/app/actions/userActions";


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
    const user = await getUser();
    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
      }


  const { id } = params;

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Delete the answers
      const deletedAnswers = await prisma.answer.deleteMany({
        where: {
          propertyId: id,
          userId: user.id,
        },
      });

      // Check if there are any remaining answers for this property
      const remainingAnswers = await prisma.answer.count({
        where: {
          propertyId: id,
        },
      });

      // If no answers remain, delete the property
      let deletedProperty = null;
      if (remainingAnswers === 0) {
        deletedProperty = await prisma.property.delete({
          where: {
            id: id,
          },
        });
      }

      return { deletedAnswers, deletedProperty };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error deleting answers and property:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
