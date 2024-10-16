import Link from "next/link";
import { FaUsers, FaHome, FaHandshake } from "react-icons/fa";

export default function AboutPage() {
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
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">About Dream House</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Welcome to HC, the go-to platform for honest, community-driven insights on properties and homes. We believe that finding the perfect home should be a smooth and informed process. Whether you&apos;re renting or buying, moving into a new apartment, or purchasing a house, the details matter. That&apos;s why we&apos;ve created a space where real people who have lived in these homes can share their experiences and help others make the right decision.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              At HC, we&apos;re more than just a review site. We&apos;re a community of renters, buyers, and homeowners who believe in transparency and helping each other find the best living spaces. Our mission is to turn property searches from guesswork into an informed, reliable experience.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: FaUsers, title: "Client-Focused", description: "We put our clients&apos; needs first, always" },
                { icon: FaHome, title: "Quality Homes", description: "We only list properties that meet our high standards" },
                { icon: FaHandshake, title: "Integrity", description: "We conduct our business with honesty and transparency" },
              ].map((value, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <value.icon className="text-3xl text-blue-500 dark:text-blue-400 mb-2" />
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-1">{value.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
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