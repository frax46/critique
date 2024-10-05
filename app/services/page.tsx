import { IconType } from 'react-icons';
import { FaChartLine, FaHome, FaSearchDollar, FaClipboardCheck } from 'react-icons/fa';
import Link from 'next/link';

interface Service {
  title: string;
  description: string;
  icon: IconType;
}

const services: Service[] = [
  {
    title: 'Property Analysis',
    description: 'In-depth analysis of property features, location, and potential for growth.',
    icon: FaSearchDollar,
  },
  {
    title: 'Market Trends',
    description: 'Stay ahead with our comprehensive market trend reports and predictions.',
    icon: FaChartLine,
  },
  {
    title: 'Home Inspections',
    description: 'Thorough inspections to ensure the property meets all quality standards.',
    icon: FaHome,
  },
  {
    title: 'Valuation',
    description: 'Accurate property valuation using advanced algorithms and market data.',
    icon: FaClipboardCheck,
  },
];

export default function Services() {
  return (
    <main className="min-h-screen w-full bg-blue-50 relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-64 w-full flex flex-col items-center justify-center bg-blue-600 text-white">
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl">Comprehensive solutions for your property needs</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="bg-blue-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center mb-4">
                      <service.icon className="text-4xl text-blue-600 mr-4" />
                      <h2 className="text-2xl font-semibold text-blue-800">{service.title}</h2>
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to experience our services?</h2>
          <p className="text-xl mb-8">Let us help you find and evaluate your perfect property.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/contact">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-100 transition duration-300 transform hover:scale-105 shadow-lg">
                Contact Us
              </button>
            </Link>
            <Link href="/subscribe">
              <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-semibold text-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105 shadow-lg animate-pulse">
                Subscribe Now
              </button>
            </Link>
          </div>
        </div>
      </section>

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
              backgroundColor: ['#3498db', '#2980b9', '#1abc9c', '#16a085', '#2c3e50'][i],
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </main>
  );
}