import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search for:', query);
    // Add your search logic here
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl flex items-center bg-white rounded-full shadow-md overflow-hidden"
    >
      {/* Search Icon */}
      <div className="pl-4">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for universities, courses..."
        className="grow px-4 py-3 focus:outline-none text-gray-700"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-900 cursor-pointer text-white px-6 py-3 rounded-full hover:bg-blue-800 transition-colors font-medium"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
