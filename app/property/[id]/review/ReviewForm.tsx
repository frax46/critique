'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaStar } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast'; // Add toast import here
import { useReviewLogic } from '@/hooks/useReviewLogic';

interface ReviewFormProps {
  propertyId: string;
  initialAddress: string;
}

export function ReviewForm({ propertyId, initialAddress }: ReviewFormProps) {
  const {
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
    handleSubmitReview,
  } = useReviewLogic(propertyId, initialAddress);

  const renderStars = (questionId: string) => {
    const currentRating = answers.find((a) => a.questionId === questionId)?.rating || 0;
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${star <= currentRating ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => handleRatingChange(questionId, star)}
          />
        ))}
      </div>
    );
  };

  const renderReviewStep = () => {
    if (reviewStep === 0) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Confirm Property Address</h2>
          <Input
            placeholder="Enter address"
            value={reviewAddress}
            onChange={(e) => setReviewAddress(e.target.value)}
          />
          <Input
            placeholder="Enter postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
          <Input
            placeholder="Enter house number"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
          />
        </div>
      );
    } else if (reviewStep <= questions.length) {
      const question = questions[reviewStep - 1];
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Question {reviewStep} of {questions.length}</h2>
          <p className="text-lg">{question.text}</p>
          {renderStars(question.id)}
          <Textarea
            placeholder="Your answer"
            value={answers.find((a) => a.questionId === question.id)?.text || ''}
            onChange={(e) => handleTextChange(question.id, e.target.value)}
          />
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Review Summary</h2>
          <p>Address: {reviewAddress}</p>
          <p>Postcode: {postcode}</p>
          <p>House Number: {houseNumber}</p>
          {answers.map((answer, index) => (
            <div key={answer.questionId} className="border-t pt-2">
              <p>Question {index + 1}: {questions[index].text}</p>
              <p>Rating: {answer.rating}</p>
              <p>Answer: {answer.text}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  const handleSubmit = async () => {
    try {
      await handleSubmitReview();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {renderReviewStep()}
      <div className="flex justify-between mt-6">
        {reviewStep > 0 && (
          <Button onClick={handlePreviousStep} variant="outline">Previous</Button>
        )}
        <Button 
          onClick={reviewStep <= questions.length ? handleNextStep : handleSubmit} 
          className="ml-auto"
        >
          {reviewStep <= questions.length ? 'Next' : 'Submit Review'}
        </Button>
      </div>
      <Toaster />
    </div>
  );
}