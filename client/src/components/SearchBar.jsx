import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-transparent hover:border-blue-200 transition-all duration-300">
        {/* Search Icon */}
        <div className="absolute left-6 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for universities, courses..."
          className="flex-1 pl-14 pr-4 py-5 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none text-base sm:text-lg"
        />

        {/* Search Button */}
        <button
          type="submit"
          className="shrink-0 px-8 py-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
        >
          <span className="hidden sm:inline">Search</span>
          <Search className="w-5 h-5 sm:hidden" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;