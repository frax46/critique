import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-4xl w-full">
        {/* Decorative SVG shapes */}
        <svg className="absolute top-0 left-0 -mt-12 -ml-12 text-blue-500 opacity-50 h-24 w-24" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" />
        </svg>
        <svg className="absolute bottom-0 right-0 -mb-12 -mr-12 text-purple-500 opacity-50 h-24 w-24" fill="currentColor" viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" rx="20" />
        </svg>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">Contact Us</h1>
          
          <div className="md:flex">
            {/* Left side: SVG illustration */}
            <div className="md:w-1/2 p-6 flex items-center justify-center">
              <svg className="w-full h-auto max-w-sm text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor" />
              </svg>
            </div>

            {/* Right side: Contact information */}
            <div className="md:w-1/2 p-6">
              <h2 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-400">Get in Touch</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">We&apos;re here to help and answer any question you might have. We look forward to hearing from you.</p>
              <Link 
                href="mailto:contact@example.com" 
                className="inline-block text-xl font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
              >
                contact@example.com
              </Link>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                123 Main Street<br />
                City, State 12345<br />
                (123) 456-7890
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
