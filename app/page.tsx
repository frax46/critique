import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaHome, FaClipboardList } from "react-icons/fa";
import ReviewCard from "./components/ReviewCard";


async function getRandomReviews() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/random`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return res.json();
}

export default async function Home() {
  let randomReviews = [];
  try {
    randomReviews = await getRandomReviews();
  } catch (error) {
    console.error('Failed to fetch random reviews:', error);
    // You might want to set an error state here or handle the error in some way
  }

  return (
    <main className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center">
        <Image
          src="/background.png"
          alt="Dream house background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-300 ease-in-out transform hover:scale-105">
            Find the house of your dreams
          </h1>
          <Link href="/search">
            <button className="get-started-btn bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-full font-bold text-xl hover:from-blue-600 hover:to-purple-700 transition duration-300 shadow-lg mb-8">
              Get Started
            </button>
          </Link>
          
          {/* Random Reviews */}
          {randomReviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">What our users say</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {randomReviews.map((review: any) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaSearch, title: "Find Properties", description: "Search through our extensive database of homes" },
              { icon: FaHome, title: "Virtual Tours", description: "Experience properties from the comfort of your home" },
              { icon: FaClipboardList, title: "Expert Advice", description: "Get insights from our real estate professionals" },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl">
                <feature.icon className="text-5xl text-blue-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-12">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-blue-50 rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
                <Image
                  src={`/property${item}.jpg`}
                  alt={`Featured Property ${item}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Beautiful Home {item}</h3>
                  <p className="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <Link href={`/property/${item}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your dream home?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied homeowners who found their perfect match with us.</p>
          <Link href="/signup">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-100 transition duration-300 transform hover:scale-105 shadow-lg">
              Sign Up Now
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
