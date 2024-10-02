import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

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
  const [reviewStep, setReviewStep] = useState(initialAddress ? 1 : 0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reviewAddress, setReviewAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    fetchQuestions();
    if (initialAddress) {
      parseInitialAddress(initialAddress);
    }
  }, [initialAddress]);

  const parseInitialAddress = (address: string) => {
    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      setReviewAddress(parts.slice(0, -2).join(', '));
      setPostcode(parts[parts.length - 2]);
      setHouseNumber(parts[parts.length - 1]);
    } else {
      setReviewAddress(address);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions. Please try again.');
    }
  };

  const handleNextStep = () => {
    if (reviewStep === 0) {
      if (!reviewAddress || !postcode || !houseNumber) {
        toast.error('Please enter a complete address, including postcode and house number');
        return;
      }
      setReviewStep(1);
      return;
    }
    
    if (reviewStep <= questions.length) {
      const currentAnswer = answers.find((a) => a.questionId === questions[reviewStep - 1].id);
      if (!currentAnswer || currentAnswer.rating === 0 || !currentAnswer.text.trim()) {
        toast.error('Please provide a rating and answer');
        return;
      }
    }
    
    if (reviewStep < questions.length) {
      setReviewStep(reviewStep + 1);
    } else if (reviewStep === questions.length) {
      setReviewStep(questions.length + 1);
    } else {
      handleSubmitReview();
    }
  };

  const handlePreviousStep = () => {
    setReviewStep(reviewStep - 1);
  };

  const handleSubmitReview = async () => {
    if (!isLoaded || !user || !user.id) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (answers.length !== questions.length) {
      toast.error('Please answer all questions');
      return;
    }

    try {
      const reviewData = { 
        propertyId,
        address: reviewAddress, 
        postcode, // Include postcode
        houseNumber, // Include houseNumber
        answers: answers.map(answer => ({
          questionId: answer.questionId,
          rating: answer.rating,
          text: answer.text
        })),
        userId: user.id
      };
      
      console.log('Submitting review data:', reviewData);

      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Review submitted successfully');
        setReviewStep(0);
        setAnswers([]);
        router.push('/thank-you');
      } else {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit review. Please try again.');
    }
  };

  const handleRatingChange = (questionId: string, rating: number) => {
    setAnswers(prev => {
      const existingAnswer = prev.find(a => a.questionId === questionId);
      if (existingAnswer) {
        return prev.map(a => a.questionId === questionId ? { ...a, rating } : a);
      } else {
        return [...prev, { questionId, rating, text: '' }];
      }
    });
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers(prev => {
      const existingAnswer = prev.find(a => a.questionId === questionId);
      if (existingAnswer) {
        return prev.map(a => a.questionId === questionId ? { ...a, text } : a);
      } else {
        return [...prev, { questionId, rating: 0, text }];
      }
    });
  };

  return {
    reviewStep,
    questions,
    reviewAddress,
    setReviewAddress,
    postcode,
    setPostcode,
    houseNumber,
    setHouseNumber,
    answers,
    handleNextStep,
    handlePreviousStep,
    handleRatingChange,
    handleTextChange,
    handleSubmitReview, // Add this to the returned object
  };
}