import Image from "next/image";
import Link from "next/link";
import { FaUsers, FaHome, FaHandshake } from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-blue-50">
      {/* Hero Section */}
      <section className="relative h-64 w-full flex flex-col items-center justify-center mb-12">
        <Image
          src="/background.png"
          alt="About us background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Dream House
          </h1>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8">Our Story</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 mb-4">
            Welcome to HC, the go-to platform for honest, community-driven insights on properties and homes. We believe that finding the perfect home should be a smooth and informed process. Whether you're renting or buying, moving into a new apartment, or purchasing a house, the details matter. That's why we've created a space where real people who have lived in these homes can share their experiences and help others make the right decision.

Our platform allows users to answer detailed questions about the properties they've lived in, providing ratings on important aspects such as comfort, neighborhood quality, maintenance, and overall living experience. By offering this crowdsourced feedback, we aim to empower home seekers with the information they need to decide if a property is worth visiting or if it’s the perfect place to call home.

At HC, we’re more than just a review site. We’re a community of renters, buyers, and homeowners who believe in transparency and helping each other find the best living spaces. Our mission is to turn property searches from guesswork into an informed, reliable experience. We’re here to save you time, stress, and most importantly, to help you find a home that feels right for you.

Explore, compare, and discover the home you’ve been looking for—guided by real voices, real experiences, and real insights.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaUsers, title: "Client-Focused", description: "We put our clients' needs first, always" },
              { icon: FaHome, title: "Quality Homes", description: "We only list properties that meet our high standards" },
              { icon: FaHandshake, title: "Integrity", description: "We conduct our business with honesty and transparency" },
            ].map((value, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl">
                <value.icon className="text-5xl text-blue-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <div key={member} className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
                <Image
                  src={`/team-member${member}.jpg`}
                  alt={`Team Member ${member}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">John Doe {member}</h3>
                  <p className="text-gray-600 mb-4">Real Estate Expert</p>
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
          <p className="text-xl mb-8">Let our experienced team guide you through the process.</p>
          <Link href="/search">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-100 transition duration-300 transform hover:scale-105 shadow-lg">
              Start Your Search
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}