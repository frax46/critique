'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaStar, FaSearch } from 'react-icons/fa';
import { StartReviewButton } from '@/components/StartReviewButton';
import { useReviewLogic } from '@/hooks/useReviewLogic';

interface Property {
  id: string;
  address: string;
  postcode: string;
  houseNumber: string;
}

export default function PropertySearch() {
  const [searchPostcode, setSearchPostcode] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<'found' | 'not_found' | null>(null);
  const [foundProperties, setFoundProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [isReviewMode, setIsReviewMode] = useState(false);
  const reviewLogic = useReviewLogic();

  useEffect(() => {
    const fetchAddressSuggestions = async () => {
      if (searchAddress.length > 2) {
        try {
          const response = await fetch(`/api/address-suggestions?query=${encodeURIComponent(searchAddress)}`);
          const data = await response.json();
          setAddressSuggestions(data.suggestions);
        } catch (error) {
          console.error('Error fetching address suggestions:', error);
        }
      } else {
        setAddressSuggestions([]);
      }
    };

    fetchAddressSuggestions();
  }, [searchAddress]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: searchPostcode, address: searchAddress }),
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
    reviewLogic.setReviewAddress(searchAddress);
    reviewLogic.setPostcode(searchPostcode);
    reviewLogic.setReviewStep(0);
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

  const handleAddressSuggestionSelect = (suggestion: string) => {
    setSearchAddress(suggestion);
    setAddressSuggestions([]);
    
    const postcodeMatch = suggestion.match(/\b[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}\b/);
    if (postcodeMatch) {
      setSearchPostcode(postcodeMatch[0]);
    }
  };

  const renderReviewStep = () => {
    if (reviewLogic.reviewStep === 0) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Enter Property Details</h2>
          <Input
            placeholder="Full Address"
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
          <Button onClick={() => setIsReviewMode(false)} className="bg-blue-500 hover:bg-blue-600 text-white">
            Back to Search
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

  return (
    <main className="min-h-screen w-full bg-blue-50">
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
                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode (required)
                    </label>
                    <div className="relative group">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 ease-in-out group-focus-within:text-blue-500" />
                      <Input
                        id="postcode"
                        type="text"
                        placeholder="Enter postcode"
                        value={searchPostcode}
                        onChange={(e) => setSearchPostcode(e.target.value)}
                        className="pl-10 w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address (optional)
                    </label>
                    <div className="relative group">
                      <Input
                        id="address"
                        type="text"
                        placeholder="Enter address"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
                      />
                    </div>
                    {addressSuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                        {addressSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleAddressSuggestionSelect(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={isLoading}
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
                    {reviewLogic.reviewStep < reviewLogic.questions.length ? 'Next' : 'Submit Review'}
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