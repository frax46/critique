
import { DashboardSummary } from '../components/DashboardSummary';
import { QuestionForm } from '../components/QuestionForm';

export default function DashboardPage() {
  return (
    <>
      <DashboardSummary />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 ">Create a New Question</h2>
        <QuestionForm />
      </div>
    </>
  );
}