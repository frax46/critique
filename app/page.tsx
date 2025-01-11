import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaHome, FaClipboardList } from "react-icons/fa";
import ReviewCard from "./components/ReviewCard";

async function getRandomReviews() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/random`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return res.json();
}

export default async function Home() {
  let randomReviews = [];
  try {
    randomReviews = await getRandomReviews();
  } catch (error) {
    console.error("Failed to fetch random reviews:", error);
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
        <div className="absolute inset-0 bg-blue-900 bg-opacity-20" />
        <div className="relative z-10 text-center px-4">
          <div className="flex flex-col">
            <div className="">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-300 ease-in-out transform hover:scale-105 z-20 relative">
                Find the house of your dreams
              </h1>
            </div>
            <div className=""></div>
          </div>

          <p className="text-white mb-8 text-2xl text-center">
            The best way to find your dream home.
            <br />
            We have the best community of people who are looking for their next
            nest
          </p>
          
          <Link href="/search">
            <button className="get-started-btn bg-gradient-to-r from-green-500 to-green-900 text-white px-10 py-4 rounded-full font-bold text-xl hover:from-green-900 hover:to-green-500 transition duration-300 shadow-lg mb-8">
              Get Started
            </button>
          </Link>

          {/* Random Reviews */}
          {randomReviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                What our users say
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {randomReviews.map((review: any) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Service Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-green-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-12 relative">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaSearch,
                title: "Find Properties",
                description: "Search through our extensive database of homes",
              },
              {
                icon: FaHome,
                title: "Virtual Tours", 
                description:
                  "Experience properties from the comfort of your home",
              },
              {
                icon: FaClipboardList,
                title: "Expert Advice",
                description: "Get insights from our real estate professionals",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-green-100 group"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform group-hover:scale-110">
                  <feature.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-12 relative">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-green-100 group"
              >
                <Image
                  src={`/house${item}.png`}
                  alt={`Featured Property ${item}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">
                    Beautiful Home {item}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <Link href={`/property/${item}`}>
                    <button className="bg-gradient-to-br from-green-500 to-green-700 text-white px-6 py-2 rounded-full text-sm hover:from-green-600 hover:to-green-800 transition duration-300 transform hover:scale-105">
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
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to find your dream home?
          </h2>
          <p className="text-xl mb-8 text-green-50">
            Join thousands of satisfied homeowners who found their perfect match
            with us.
          </p>
          <Link href="/signup">
            <button className="get-started-btn bg-white text-green-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1 shadow-xl">
              Get Started Today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-green-900 to-green-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              
              <p className="text-green-100">
                We help you find the perfect property that matches your dreams and budget.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/properties" className="text-green-100 hover:text-white transition">Properties</Link></li>
                <li><Link href="/services" className="text-green-100 hover:text-white transition">Services</Link></li>
                <li><Link href="/contact" className="text-green-100 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-green-100">
                <li>123 Real Estate Ave</li>
                <li>contact@realestate.com</li>
                <li>(555) 123-4567</li>
              </ul>
            </div>
            
          </div>
          <div className="border-t border-green-800 pt-8 text-center text-green-100">
            <p>&copy; 2024 Real Estate Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
