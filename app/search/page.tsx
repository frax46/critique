'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaStar } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import { StartReviewButton } from '@/components/StartReviewButton';
import { useReviewLogic } from '@/hooks/useReviewLogic';

interface Question {
  id: string;
  text: string;
}

interface Answer {
  questionId: string;
  rating: number;
  text: string;
}

declare global {
  interface Window {
    google: any;
    initializeAutocomplete: () => void;
  }
}

export default function PropertySearch() {
  const [address, setAddress] = useState('');
  const [searchResult, setSearchResult] = useState<'found' | 'not_found' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const reviewAutocompleteRef = useRef<HTMLInputElement>(null);
  const { user, isLoaded } = useUser();

  const [isReviewMode, setIsReviewMode] = useState(false);
  const reviewLogic = useReviewLogic();

  const initializeAutocomplete = () => {
    if (typeof window.google === 'undefined') return;

    [autocompleteRef, reviewAutocompleteRef].forEach(ref => {
      if (!ref.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(ref.current, {
        types: ['address'],
        componentRestrictions: { country: 'GB' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const addressValue = place.formatted_address || '';
        if (ref === autocompleteRef) {
          setAddress(addressValue);
        } else {
          reviewLogic.setReviewAddress(addressValue);
          place.address_components?.forEach((component: google.maps.AddressComponent) => {
            const componentType = component.types[0];
            switch (componentType) {
              case 'postal_code':
                reviewLogic.setPostcode(component.long_name);
                break;
              case 'street_number':
                reviewLogic.setHouseNumber(component.long_name);
                break;
            }
          });
        }
      });
    });
  };

  useEffect(() => {
    window.initializeAutocomplete = initializeAutocomplete;
  }, []);

  useEffect(() => {
    if (isReviewMode) {
      initializeAutocomplete();
    }
  }, [isReviewMode]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (data.found) {
        setSearchResult('found');
        router.push(`/property/${data.property.id}`);
      } else {
        setSearchResult('not_found');
      }
    } catch (error) {
      console.error('Error searching for property:', error);
      setSearchResult('not_found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartReview = () => {
    setIsReviewMode(true);
  };

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
          <h2 className="text-2xl font-bold">Enter Property Address</h2>
          <Input
            ref={reviewAutocompleteRef}
            placeholder="Enter address"
            value={reviewLogic.reviewAddress}
            onChange={(e) => reviewLogic.setReviewAddress(e.target.value)}
          />
        </div>
      );
    } else if (reviewLogic.reviewStep <= reviewLogic.questions.length) {
      const question = reviewLogic.questions[reviewLogic.reviewStep - 1];
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Question {reviewLogic.reviewStep} of {reviewLogic.questions.length}</h2>
          <p className="text-lg">{question.text}</p>
          {renderStars(question.id)}
          <Textarea
            placeholder="Your answer"
            value={reviewLogic.answers.find((a) => a.questionId === question.id)?.text || ''}
            onChange={(e) => reviewLogic.handleTextChange(question.id, e.target.value)}
          />
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Review Summary</h2>
          <p>Address: {reviewLogic.reviewAddress}</p>
          <p>Postcode: {reviewLogic.postcode}</p>
          <p>House Number: {reviewLogic.houseNumber}</p>
          {reviewLogic.answers.map((answer, index) => (
            <div key={answer.questionId} className="border-t pt-2">
              <p>Question {index + 1}: {reviewLogic.questions[index].text}</p>
              <p>Rating: {answer.rating}</p>
              <p>Answer: {answer.text}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initializeAutocomplete`}
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        {!isReviewMode ? (
          <>
            <h1 className="text-3xl font-bold mb-8">Search for a Property</h1>
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <input
                ref={autocompleteRef}
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
            {searchResult === 'not_found' && (
              <div className="mt-8 text-center">
                <p className="text-xl mb-4">Sorry, no property found.</p>
                <StartReviewButton onClick={handleStartReview} />
              </div>
            )}
          </>
        ) : (
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            {renderReviewStep()}
            <div className="flex justify-between mt-6">
              {reviewLogic.reviewStep > 0 && (
                <Button onClick={reviewLogic.handlePreviousStep} variant="outline">Previous</Button>
              )}
              <Button onClick={reviewLogic.handleNextStep} className="ml-auto">
                {reviewLogic.reviewStep <= reviewLogic.questions.length ? 'Next' : 'Submit Review'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
}