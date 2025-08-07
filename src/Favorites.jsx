import MovieCard from "./components/MovieCard";

function Favorites({ favorites, toggleFavorite }) {
  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>

      {favorites.length === 0 ? (
        <p>No favorite movies yet.</p>
      ) : (
        <div className="movie-list">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              title={movie.Title}
              year={movie.Year}
              poster={movie.Poster}
              isFavorite={true}
              toggleFavorite={() => toggleFavorite(movie)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
