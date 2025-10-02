import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

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
    if (!searchTerm) return;
    try {
      const response = await fetch(`http://localhost:5000/api/items/search?q=${encodeURIComponent(searchTerm)}`);
      console.log("response", response);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setItems(data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  fetchSearchResults();
}, [location.search]);

  if (loading) {
    return <div className="loading">Searching...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Search Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="search-results">
      <h1>Search Results for "{searchTerm}"</h1>
      <p>{items.length} item(s) found</p>
      
      {items.length > 0 ? (
        <div className="item-grid">
          {items.map(item => (
  <div key={item._id} className="item-card">
    <h2>{item.itemName}</h2>
    <p className="item-description">{item.description}</p>
    <p className="item-price">${item.rentalPrice} per day</p>
    <p className="item-category">Category: {item.category?.name}</p>
    <p className="item-location">{item.location}</p>
    {item.owner && <p className="item-owner">Owner: {item.owner.name}</p>}
    <Link to={`/items/${item._id}`} className="btn btn-primary">
      View Details
    </Link>
  </div>
))}
        </div>
      ) : (
        <div className="no-results">
          <p>No items found matching your search.</p>
          <Link to="/" className="btn btn-primary">Browse All Items</Link>
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;
