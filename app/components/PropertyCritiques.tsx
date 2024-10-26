"use client";

import { useState } from "react";
import { Answer, Property, Question } from "@prisma/client";
import toast from "react-hot-toast";
import Modal from "./Modal";

type PropertyCritiquesProps = {
  property: Property;
  answers: (Answer & { question: Question })[];
}

export default function PropertyCritiques({ property, answers: initialAnswers, }: PropertyCritiquesProps) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteAll = async () => {
    try {
      const response = await fetch(`/api/answers/property/${property.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        setAnswers([]);
        toast.success("All answers for this property have been deleted successfully");
        

        
        
      } else {
        throw new Error("Failed to delete answers");
      }
    } catch (error) {
      console.error("Error deleting answers:", error);
      toast.error("Failed to delete answers. Please try again.");
    } finally {
      setIsModalOpen(false);
      // Redirect to home page after successful deletion
      window.location.href = '/';
    }
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        {property.address}, {property.postcode}
      </h2>
      {answers.length > 0 ? (
        <>
          <ul className="space-y-4">
            {answers.map((answer) => (
              <li key={answer.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="font-medium mb-2 dark:text-white">{answer.question.text}</p>
                <p className="text-gray-700 dark:text-gray-300">{answer.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Delete All Answers for This Property
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">No answers available for this property.</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAll}
        title="Confirm Deletion"
        message="Are you sure you want to delete all answers for this property? This action cannot be undone."
      />
    </div>
  );
}
