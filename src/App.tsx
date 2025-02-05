import React, { useState, useEffect } from 'react';
import fetchJsonp from 'fetch-jsonp';
import './App.css';

// Theme toggle icons
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    height="24"
    width="24"
    viewBox="0 0 24 24"
  >
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    height="24"
    width="24"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

// Magnifying glass icon for the search button
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    height="24"
    width="24"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// Hamburger menu component
const HamburgerMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  return (
    <div className="hamburger-menu">
      <button className="hamburger-button" onClick={toggleMenu} aria-label="Menu">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      {open && (
        <div className="hamburger-dropdown">
          <ul>
            <li
              onClick={() => {
                window.open("https://github.com/prysyazhny/youtube-simplified", "_blank");
                setOpen(false);
              }}
            >
              GitHub
            </li>
            {/* Add more dropdown options here if needed */}
          </ul>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPureBlack, setIsPureBlack] = useState(false);

  // Check localStorage for saved theme mode on mount.
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'black') {
      setIsPureBlack(true);
    }
  }, []);

  // Save theme to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem('theme', isPureBlack ? 'black' : 'gray');
  }, [isPureBlack]);

  // Debounce and fetch suggestions when the query changes.
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      fetchJsonp(
        `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data[1]) {
            setSuggestions(data[1]);
          }
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
        });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() === '') return;
    window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  const toggleTheme = () => {
    setIsPureBlack((prev) => !prev);
  };

  return (
    <div className={`container ${isPureBlack ? 'theme-black' : 'theme-gray'}`}>
      {/* Hamburger menu in the top-left corner */}
      <HamburgerMenu />

      {/* Theme toggle button in the top-right corner */}
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {isPureBlack ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Centered "YouTube, Simplified" logo */}
      <div className="logo-container">
        <h1 className="logo">YouTube, Simplified</h1>
      </div>

      {/* Search bar with autocomplete */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-wrapper">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search YouTube"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Search">
              <SearchIcon />
            </button>
          </div>
          {suggestions.length > 0 && (
            <div className="suggestions-container">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default App;