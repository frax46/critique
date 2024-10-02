import { IconType } from 'react-icons';
import { FaChartLine, FaHome, FaSearchDollar, FaClipboardCheck } from 'react-icons/fa';

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

      <div className="max-w-6xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white text-center">Our Services</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="flex items-center mb-4">
                  <service.icon className="text-4xl text-purple-600 dark:text-purple-400 mr-4" />
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{service.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              </div>
            ))}
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