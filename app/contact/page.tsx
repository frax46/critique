import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-8 pt-20 flex items-center justify-center relative overflow-hidden">
      {/* Decorative SVG pattern */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.1)" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
      </svg>

      <div className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="md:flex">
          {/* Left side: SVG illustration */}
          <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <svg className="w-full h-auto max-w-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor" className="text-purple-600 dark:text-purple-400" />
            </svg>
          </div>

          {/* Right side: Contact information */}
          <div className="md:w-1/2 p-6 md:p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Get in Touch</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">We'd love to hear from you! Drop us a line anytime.</p>
            <Link 
              href="mailto:contact@example.com" 
              className="inline-block text-2xl font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300"
            >
              contact@example.com
            </Link>
          </div>
        </div>
      </div>

      {/* Animated floating shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              backgroundColor: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'][i],
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}