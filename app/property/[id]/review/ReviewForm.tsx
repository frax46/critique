'use client';

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaStar } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useReviewLogic } from '@/hooks/useReviewLogic';

interface ReviewFormProps {
  propertyId: string;
  initialAddress: string;
  postcode: string;
}

export function ReviewForm({ propertyId, initialAddress, postcode }: ReviewFormProps) {
  const reviewLogic = useReviewLogic(propertyId, initialAddress, postcode);

  useEffect(() => {
    // Extract postcode from initialAddress
    const postcodeRegex = /\b[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}\b/;
    const match = initialAddress.match(postcodeRegex);
    if (match) {
      const postcode = match[0];
      const addressWithoutPostcode = initialAddress.replace(postcode, '').trim();
      reviewLogic.setReviewAddress(addressWithoutPostcode);
      reviewLogic.setPostcode(postcode);
    } else {
      reviewLogic.setReviewAddress(initialAddress);
    }
  }, [initialAddress]);

  const renderStars = (questionId: string) => {
    const currentRating = reviewLogic.answers.find((a) => a.questionId === questionId)?.rating || 0;
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${star <= currentRating ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => reviewLogic.handleRatingChange(questionId, star)}
          />
        ))}
      </div>
    );
  };

  const renderReviewStep = () => {
    if (reviewLogic.reviewStep === 0) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Confirm Property Details</h2>
          <Input
            placeholder="Full Address (without postcode)"
            value={reviewLogic.reviewAddress}
            onChange={(e) => reviewLogic.setReviewAddress(e.target.value)}
            required
          />
          <Input
            placeholder="Postcode"
            value={reviewLogic.postcode}
            onChange={(e) => reviewLogic.setPostcode(e.target.value)}
            required
          />
        </div>
      );
    }

    const currentQuestion = reviewLogic.getCurrentQuestion();
    
    if (!currentQuestion) {
      return (
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">An error occurred while loading the question.</p>
          <Button onClick={() => reviewLogic.setReviewStep(0)} className="bg-blue-500 hover:bg-blue-600 text-white">
            Back to Start
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Question {reviewLogic.reviewStep} of {reviewLogic.questions.length}</h2>
        <p className="text-lg">{currentQuestion.text}</p>
        {renderStars(currentQuestion.id)}
        <Textarea
          placeholder="Your answer"
          value={reviewLogic.answers.find((a) => a.questionId === currentQuestion.id)?.text || ''}
          onChange={(e) => reviewLogic.handleTextChange(currentQuestion.id, e.target.value)}
        />
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      await reviewLogic.handleSubmitReview();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {renderReviewStep()}
      <div className="flex justify-between mt-6">
        {reviewLogic.reviewStep > 0 && (
          <Button onClick={reviewLogic.handlePreviousStep} variant="outline">Previous</Button>
        )}
        <Button 
          onClick={reviewLogic.reviewStep < reviewLogic.questions.length ? reviewLogic.handleNextStep : handleSubmit} 
          className="ml-auto bg-blue-500 hover:bg-blue-600 text-white"
        >
          {reviewLogic.reviewStep < reviewLogic.questions.length ? 'Next' : 'Submit Review'}
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
