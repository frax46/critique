import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PropertyCritiques from "../components/PropertyCritiques";
import { getUser } from "../actions/userActions";

export const dynamic = 'force-dynamic';


export default async function MyCritiques() {
  const user = await getUser();
  
  if (!user) {
    redirect("/no-critique");
  }
  
  const userAnswers = await prisma.answer.findMany({
    where: {
      userId: user.id,
    },
    include: {
      property: true,
      question: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const answersByProperty = userAnswers.reduce((acc, answer) => {
    const propertyId = answer.property.id;
    if (!acc[propertyId]) {
      acc[propertyId] = {
        property: answer.property,
        answers: [],
      };
    }
    acc[propertyId].answers.push(answer);
    return acc;
  }, {} as Record<string, { property: any; answers: any[] }>);

  if (Object.values(answersByProperty).length === 0) {
    redirect("/no-critique");
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">My Critiques</h1>
      {Object.values(answersByProperty).map((propertyData) => (
        <PropertyCritiques
          key={propertyData.property.id}
          property={propertyData.property}
          answers={propertyData.answers}
        />
      ))}
    </div>
  );
}
