import React, { useState } from "react";

const colleges = [
  {
    id: 1,
    name: "Thames International College",
    university: "Tribhuvan University",
    address: "Surya Bikram Gyawali Marg, Old Baneshwor, Kathmandu",
    image: "https://images.unsplash.com/photo-1603437119287-4a3732b685f9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    level: "Bachelors",
    degree: "Bachelor of Business Studies",
    district: "Kathmandu",
    affiliation: "Tribhuvan University",
  },
  {
    id: 2,
    name: "Texas College of Management and IT",
    university: "Tribhuvan University",
    address: "New Baneshwor, Kathmandu",
    image: "https://images.unsplash.com/photo-1593694747763-f4a6b8e42459?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    level: "Masters",
    degree: "Master of Business Studies",
    district: "Kathmandu",
    affiliation: "Tribhuvan University",
  },
  {
    id: 3,
    name: "Lincoln University College",
    university: "Lincoln University College",
    address: "Siphal, Kathmandu",
    image: "https://images.unsplash.com/photo-1720323650006-6dd831b7c8b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29sbGVnZXN8ZW58MHx8MHx8fDA%3D",
    level: "Bachelors",
    degree: "Bachelor in Business Administration",
    district: "Kathmandu",
    affiliation: "Lincoln University College",
  },
  {
    id: 4,
    name: "Ace Institute of Management",
    university: "Tribhuvan University",
    address: "Samakhusi, Kathmandu",
    image: "https://images.unsplash.com/photo-1620725355497-56f6fc163b72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbGxlZ2VzfGVufDB8fDB8fHww",
    level: "Masters",
    degree: "Master in Business Administration",
    district: "Kathmandu",
    affiliation: "Tribhuvan University",
  },
  {
    id: 5,
    name: "Softwarica College of IT and E-commerce",
    university: "Lincoln University College",
    address: "Samakhusi, Kathmandu",
    image: "https://images.unsplash.com/photo-1719468881231-46e33347dd1c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvbGxlZ2VzfGVufDB8fDB8fHww",
    level: "Bachelors",
    degree: "BSc in Computer Science and Information Technology",
    district: "Kathmandu",
    affiliation: "Lincoln University College",
  },
];

// unique filter values
const districts = [...new Set(colleges.map((c) => c.district))];
const levels = [...new Set(colleges.map((c) => c.level))];
const degrees = [...new Set(colleges.map((c) => c.degree))];
const affiliations = [...new Set(colleges.map((c) => c.affiliation))];

export default function CollegePage() {
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedDegrees, setSelectedDegrees] = useState([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState([]);

  const toggleValue = (value, setState) => {
    setState((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const filteredColleges = colleges.filter((college) => {
    return (
      (selectedDistricts.length === 0 ||
        selectedDistricts.includes(college.district)) &&
      (selectedLevels.length === 0 ||
        selectedLevels.includes(college.level)) &&
      (selectedDegrees.length === 0 ||
        selectedDegrees.includes(college.degree)) &&
      (selectedAffiliations.length === 0 ||
        selectedAffiliations.includes(college.affiliation))
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Filters */}
      <aside className="w-1/4 p-4 bg-white shadow-md space-y-6">
        <h2 className="text-xl font-semibold">Filters</h2>

        {/* District */}
        <div>
          <h3 className="font-medium mb-2">District</h3>
          {districts.map((district) => (
            <label key={district} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedDistricts.includes(district)}
                onChange={() =>
                  toggleValue(district, setSelectedDistricts)
                }
              />
              {district}
            </label>
          ))}
        </div>

        {/* Level */}
        <div>
          <h3 className="font-medium mb-2">Level</h3>
          {levels.map((level) => (
            <label key={level} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedLevels.includes(level)}
                onChange={() => toggleValue(level, setSelectedLevels)}
              />
              {level}
            </label>
          ))}
        </div>

        {/* Degree */}
        <div>
          <h3 className="font-medium mb-2">Degree</h3>
          {degrees.map((degree) => (
            <label key={degree} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedDegrees.includes(degree)}
                onChange={() => toggleValue(degree, setSelectedDegrees)}
              />
              {degree}
            </label>
          ))}
        </div>

        {/* Affiliation */}
        <div>
          <h3 className="font-medium mb-2">Affiliation</h3>
          {affiliations.map((aff) => (
            <label key={aff} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedAffiliations.includes(aff)}
                onChange={() =>
                  toggleValue(aff, setSelectedAffiliations)
                }
              />
              {aff}
            </label>
          ))}
        </div>

        <button
          onClick={() => {
            setSelectedDistricts([]);
            setSelectedLevels([]);
            setSelectedDegrees([]);
            setSelectedAffiliations([]);
          }}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reset Filters
        </button>
      </aside>

      {/* College Cards */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.length ? (
          filteredColleges.map((college) => (
            <div
              key={college.id}
              className="bg-white rounded shadow overflow-hidden"
            >
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{college.name}</h3>
                <p className="text-sm text-gray-600">
                  Affiliation: {college.affiliation}
                </p>
                <p className="text-sm text-gray-600">
                  Address: {college.address}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No colleges found.
          </p>
        )}
      </main>
    </div>
  );
}
