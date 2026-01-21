import React from "react";
import SearchBar from "../../components/SearchBar";

const Home = () => {
  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        {/* Background Image */}
        <img
          src="/university1.jpg"
          alt="University"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <SearchBar />

          <p className="mt-6 text-3xl md:text-4xl font-semibold text-white">
            Find the course that suits you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
