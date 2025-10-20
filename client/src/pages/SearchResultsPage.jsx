import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios

// Helper hook to get URL query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = useQuery();
  const searchTerm = query.get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setLoading(false);
        return;
      }
      
      setLoading(true); // Set loading true at the start of a new search
      try {
        // 2. Use axios and the proxied URL
        const response = await axios.get(`/api/items/search?q=${encodeURIComponent(searchTerm)}`);
        
        setItems(response.data); // 3. Get data from response.data
        setError('');
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || err.message || "Failed to fetch results");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm, location.search]); // location.search ensures re-fetch if query string changes

  if (loading) {
    return <div className="loading">Searching...</div>;
  }

  if (error) {
    return (
      <div className="error" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Search Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    // 4. Use the same outer structure as HomePage
    <div>
      <h2 className="heading">Search Results for "{searchTerm}"</h2>
      
      {items.length > 0 ? (
        <div className="item-grid">
          {/* 5. THIS IS THE CARD STRUCTURE COPIED FROM HOMEPAGE */}
          {items.map((item) => (
            <Link
              to={`/item/${item._id}`} // Use singular '/item/' to match HomePage
              key={item._id}
              style={{ textDecoration: "none" }}
            >
              <div className="item-card">
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="item-card-img"
                />
                <div className="item-card-content">
                  <h2>
                    ₹{item.rentalPrice} {/* Use '₹' to match HomePage */}
                  </h2>
                  <p>{item.itemName}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-results" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No items found matching your search.</p>
          <Link to="/" className="btn btn-primary">Browse All Items</Link>
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;