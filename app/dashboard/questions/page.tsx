import { QuestionsList } from "@/app/components/QuestionsList";

export default function QuestionsPage() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Questions</h2>
      <QuestionsList />
    </>
  );
}