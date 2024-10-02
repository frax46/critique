import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full relative">
      {/* Hero Section */}
      <div className="absolute inset-0">
        <Image
          src="/background.webp"
          alt="Dream house background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      <div className="relative h-screen w-full flex flex-col items-center justify-center px-4 text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 transition-all duration-300 ease-in-out transform scale-90 hover:scale-100">
          Find the house of your dreams
        </h1>
        <Link href="/search">
          <button className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-pink-600 transition duration-300 transform hover:scale-105 hover:animate-bounce">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
