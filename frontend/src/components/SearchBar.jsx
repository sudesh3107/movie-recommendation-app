import { Search, X } from 'lucide-react';

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        placeholder="Search by title or director..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search movies"
      />
      {value && (
        <button className="clear-btn" onClick={() => onChange('')} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
