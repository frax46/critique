import React from 'react';

interface PropertyDetailsProps {
  property: {
    id: string;
    address: string;
    postcode: string;
    houseNumber: string;
    averageRating: number;
    answers: Array<{ rating: number; userId: string }>;
  };
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const averageRating = property.answers.length > 0
    ? property.answers.reduce((sum, answer) => sum + answer.rating, 0) / property.answers.length
    : null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{property.address}</p>
          <p className="text-sm text-gray-600">{property.postcode}</p>
        </div>
      </div>
      <div className="mt-4">
        <p>House Number: <span className="font-semibold">{property.houseNumber}</span></p>
        {averageRating !== null && (
          <div className="flex items-center mt-2">
            <span className="text-lg font-semibold mr-2">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({averageRating.toFixed(1)})
            </span>
          </div>
        )}
        <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
          Reviews: {property.answers.length}
        </div>
      </div>
    </div>
  );
}