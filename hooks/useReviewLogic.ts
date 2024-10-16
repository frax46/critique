import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

interface Question {
  id: string;
  text: string;
}

interface Answer {
  questionId: string;
  rating: number;
  text: string;
}

export function useReviewLogic(propertyId?: string, initialAddress?: string) {
  const [reviewStep, setReviewStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reviewAddress, setReviewAddressState] = useState(initialAddress || "");
  const [postcode, setPostcodeState] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      console.log('Fetched questions:', data);
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions. Please try again.");
    }
  };

  const handleNextStep = () => {
    if (reviewStep === 0) {
      if (!reviewAddress.trim() || !postcode.trim()) {
        toast.error("Please enter a complete address, including postcode");
        return;
      }
      setReviewStep(1);
      return;
    }

    if (reviewStep <= questions.length) {
      const currentAnswer = answers.find(
        (a) => a.questionId === questions[reviewStep - 1].id
      );
      if (!currentAnswer || currentAnswer.rating === 0 || !currentAnswer.text.trim()) {
        toast.error("Please provide a rating and answer");
        return;
      }
    }

    if (reviewStep < questions.length) {
      setReviewStep(reviewStep + 1);
    } else {
      handleSubmitReview();
    }
  };

  const handlePreviousStep = () => {
    setReviewStep(Math.max(0, reviewStep - 1));
  };

  const handleSubmitReview = async () => {
    if (!isLoaded || !user || !user.id) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (answers.length !== questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    try {
      const reviewData = {
        propertyId,
        address: reviewAddress,
        postcode,
        answers: answers.map((answer) => ({
          questionId: answer.questionId,
          rating: answer.rating,
          text: answer.text,
        })),
        userId: user.id,
      };

      console.log("Submitting review data:", reviewData);

      const response = await fetch("/api/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        toast.success("Review submitted successfully");
        setReviewStep(0);
        setAnswers([]);
        router.push("/thank-you");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit review. Please try again."
      );
    }
  };

  const handleRatingChange = (questionId: string, rating: number) => {
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex((a) => a.questionId === questionId);
      if (existingAnswerIndex > -1) {
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = { ...updatedAnswers[existingAnswerIndex], rating };
        return updatedAnswers;
      } else {
        return [...prev, { questionId, rating, text: "" }];
      }
    });
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex((a) => a.questionId === questionId);
      if (existingAnswerIndex > -1) {
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = { ...updatedAnswers[existingAnswerIndex], text };
        return updatedAnswers;
      } else {
        return [...prev, { questionId, rating: 0, text }];
      }
    });
  };

  const getCurrentQuestion = () => {
    return questions[reviewStep - 1] || null;
  };

  const setReviewAddress = (address: string) => {
    console.log("Setting review address:", address);
    setReviewAddressState(address);
  };

  const setPostcode = (code: string) => {
    console.log("Setting postcode:", code);
    setPostcodeState(code);
  };

  return {
    reviewStep,
    questions,
    reviewAddress,
    setReviewAddress,
    postcode,
    setPostcode,
    answers,
    handleNextStep,
    handlePreviousStep,
    handleRatingChange,
    handleTextChange,
    handleSubmitReview,
    getCurrentQuestion,
    setReviewStep,
  };
}
