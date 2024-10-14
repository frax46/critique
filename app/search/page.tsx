'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaStar, FaSearch } from 'react-icons/fa';
import { StartReviewButton } from '@/components/StartReviewButton';
import { useReviewLogic } from '@/hooks/useReviewLogic';
import Script from 'next/script';

interface Property {
  id: string;
  address: string;
  postcode: string;
  houseNumber: string;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export default function PropertySearch() {
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [searchResult, setSearchResult] = useState<'found' | 'not_found' | null>(null);
  const [foundProperties, setFoundProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const router = useRouter();
  const autocompleteInput = useRef<HTMLInputElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const [isReviewMode, setIsReviewMode] = useState(false);
  const reviewLogic = useReviewLogic();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && !isGoogleLoaded) {
      setIsGoogleLoaded(true);
    }
  }, [isGoogleLoaded]);

  useEffect(() => {
    if (isGoogleLoaded && autocompleteInput.current) {
      initializeAutocomplete();
    }
  }, [isGoogleLoaded]);

  const initializeAutocomplete = () => {
    if (autocompleteInput.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput.current, {
        types: ['address'],
        fields: ['address_components', 'formatted_address'],
        componentRestrictions: { country: "uk" },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setAddress(place.formatted_address);
          setIsAddressSelected(true);

          // Extract postcode from address components
          const postcodeComponent = place.address_components.find(
            (component: any) => component.types.includes('postal_code')
          );
          if (postcodeComponent) {
            setPostcode(postcodeComponent.long_name);
          }
        }
      });
    }
  };

  const handleScriptLoad = () => {
    setIsGoogleLoaded(true);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddressSelected) {
      alert('Please select an address from the autocomplete options.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, postcode }),
      });

      const data = await response.json();

      if (data.properties && data.properties.length > 0) {
        setSearchResult('found');
        setFoundProperties(data.properties);
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
    reviewLogic.setReviewAddress(address);
    reviewLogic.setPostcode(postcode);
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
          <h2 className="text-2xl font-bold">Confirm Property Details</h2>
          <Input
            placeholder="Postcode"
            value={reviewLogic.postcode}
            onChange={(e) => reviewLogic.setPostcode(e.target.value)}
          />
          <Input
            placeholder="Address"
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
          <p>Postcode: {reviewLogic.postcode}</p>
          <p>Address: {reviewLogic.reviewAddress}</p>
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
    <main className="min-h-screen w-full bg-blue-50">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={handleScriptLoad}
      />

      {/* Hero Section */}
      <section className="relative h-64 w-full flex flex-col items-center justify-center bg-blue-600 text-white">
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find or Review a Property</h1>
          <p className="text-xl">Discover your dream home or share your experience</p>
        </div>
      </section>

      {/* Search/Review Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
            {!isReviewMode ? (
              <>
                <h2 className="text-2xl font-bold text-blue-800 mb-6">Search for a Property</h2>
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="relative">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-200 ease-in-out group-focus-within:text-blue-600">
                      Address
                    </label>
                    <div className="relative group">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 ease-in-out group-focus-within:text-blue-500" />
                      <Input
                        id="address"
                        ref={autocompleteInput}
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setIsAddressSelected(false);
                        }}
                        className="pl-10 w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={isLoading || !isAddressSelected}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </form>
                {searchResult === 'found' && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Found Properties:</h3>
                    <ul className="space-y-2">
                      {foundProperties.map((property) => (
                        <li key={property.id} className="border p-2 rounded">
                          <p>{property.address}, {property.postcode}</p>
                          <Button onClick={() => router.push(`/property/${property.id}`)}>
                            View Property
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {searchResult === 'not_found' && (
                  <div className="mt-8 text-center">
                    <p className="text-xl text-gray-600 mb-4">Sorry, no property found.</p>
                    <StartReviewButton onClick={handleStartReview} />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {renderReviewStep()}
                <div className="flex justify-between mt-6">
                  {reviewLogic.reviewStep > 0 && (
                    <Button onClick={reviewLogic.handlePreviousStep} variant="outline">Previous</Button>
                  )}
                  <Button onClick={reviewLogic.handleNextStep} className="ml-auto bg-blue-500 hover:bg-blue-600 text-white">
                    {reviewLogic.reviewStep <= reviewLogic.questions.length ? 'Next' : 'Submit Review'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}