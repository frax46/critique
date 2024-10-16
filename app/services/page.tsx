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
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">Our Services</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {services.map((service, index) => (
              <div key={index} className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="flex items-center mb-4">
                  <service.icon className="text-4xl text-blue-600 dark:text-blue-400 mr-4" />
                  <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-300">{service.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
