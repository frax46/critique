import Link from 'next/link';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* Decorative SVG shapes */}
        <svg className="absolute top-0 left-0 -mt-12 -ml-12 text-blue-500 opacity-50 h-24 w-24" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" />
        </svg>
        <svg className="absolute bottom-0 right-0 -mb-12 -mr-12 text-purple-500 opacity-50 h-24 w-24" fill="currentColor" viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" rx="20" />
        </svg>

        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            We truly appreciate your review. Your feedback helps make our community better for everyone.
          </p>
          <div className="animate-bounce mb-8">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;