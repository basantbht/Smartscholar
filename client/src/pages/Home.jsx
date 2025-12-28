import React from 'react';
import SearchBar from '../components/SearchBar';

const Home = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="w-full h-137.5 overflow-hidden relative">
        <img
          src="university1.jpg"
          alt="University"
          className="w-full h-full object-cover filter "
        />

        {/* Optional overlay for better contrast */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Search Bar overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
          <SearchBar />

          <p className=" text-4xl font-medium mt-4 text-white">
            Find the course that suits you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
