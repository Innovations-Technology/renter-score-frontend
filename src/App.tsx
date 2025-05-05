import React, { useState } from 'react';
import './App.css';
import logo from './assets/renterscore_logo_96px.png';
import searchIcon from './assets/search_icon_2tone_32px.png';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    console.log("🔍 Starting search for:", query);
    setLoading(true);
    try {
      //const response = await fetch('http://128.199.231.220/api/v2/property/properties');
      const response = await fetch('/api/api/v2/property/properties');
      const data = await response.json();
      console.log("✅ API returned:", data);

      const filtered = data.filter((item: any) =>
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.address?.street?.toLowerCase().includes(query.toLowerCase()) ||
        item.address?.region?.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered);
    } catch (error) {
      console.error('❌ Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (

    <div className="px-4 py-8">
       <div className="fixed top-2 right-4 z-50">
       <button
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md">
      Sign In
    </button>
  </div>
    <div className="hero-heading">
      <img
        src={logo}
        alt="RenterScore Logo"
        className="hero-logo"
      />
     </div>
     
      <div className="flex flex-col items-center text-center">  
      <div ><h1 className="hero-title">
        Welcome to <span className="highlight">Renter Score</span>!
      </h1></div>
      <p className="text-[#2F4858] text-lg mt-2 max-w-md">
        Faster rental decisions — with less time, less cost, and no surprises.
      </p>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search properties"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="absolute top-2.5 right-4 p-1"
        >
          <img src={searchIcon} alt="Search" className="w-4 h-4" />
        </button>
      </div>

      {/* Loading Message */}
      {loading && (
        <div className="text-center text-blue-600 text-sm">Loading properties...</div>
      )}

      {/* Display Results */}
      {!loading && (
        <div className="mt-6 max-w-2xl mx-auto grid gap-6">
          {results.length === 0 ? (
            <p className="text-gray-500 text-center">No properties found.</p>
          ) : (
            results.map((property: any) => (
              <div
                key={property.property_id}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={property.hero_image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900">{property.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{property.description}</p>
                  <div className="text-sm text-gray-700 mb-1">
                    <strong>Type:</strong> {property.property_type} • <strong>Status:</strong> {property.property_status}
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    <strong>Size:</strong> {property.size} • <strong>Price:</strong> SGD {property.price}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Address:</strong> {property.address.block_no}, {property.address.street}, {property.address.unit_no}, {property.address.postal_code}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
