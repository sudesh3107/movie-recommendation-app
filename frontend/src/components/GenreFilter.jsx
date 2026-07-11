function GenreFilter({ genres, selected, onSelect }) {
  const allGenres = ['All', ...genres];

  return (
    <div className="genre-filter" role="group" aria-label="Filter by genre">
      {allGenres.map((genre) => (
        <button
          key={genre}
          className={`genre-pill ${selected === genre ? 'active' : ''}`}
          onClick={() => onSelect(genre)}
          aria-pressed={selected === genre}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;
