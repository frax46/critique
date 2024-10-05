import Link from 'next/link';

export default function Contact() {
  return (
    <main className="min-h-screen w-full bg-blue-50">
      {/* Hero Section */}
      <section className="relative h-64 w-full flex flex-col items-center justify-center bg-blue-600 text-white">
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">We'd love to hear from you</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Left side: SVG illustration */}
              <div className="md:w-1/2 p-6 flex items-center justify-center bg-blue-100">
                <svg className="w-full h-auto max-w-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor" className="text-blue-600" />
                </svg>
              </div>

              {/* Right side: Contact information */}
              <div className="md:w-1/2 p-6 md:p-8">
                <h2 className="text-3xl font-bold mb-4 text-blue-800">Get in Touch</h2>
                <p className="text-lg text-gray-600 mb-6">We're here to help and answer any question you might have. We look forward to hearing from you.</p>
                <Link 
                  href="mailto:contact@example.com" 
                  className="inline-block text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  contact@example.com
                </Link>
                <p className="mt-4 text-gray-600">
                  123 Main Street<br />
                  City, State 12345<br />
                  (123) 456-7890
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your dream home?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied homeowners who found their perfect match with us.</p>
          <Link href="/search">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-100 transition duration-300 transform hover:scale-105 shadow-lg">
              Start Searching
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}