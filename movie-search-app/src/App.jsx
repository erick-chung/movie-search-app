import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import Spinner from "./components/Spinner";
import Favorites from "./Favorites";
import "./App.css";

function App() {
  //We create multiple pieces of state to hold data
  const [searchTerm, setSearchTerm] = useState(""); //stores user input
  const cleanSearchTerm = searchTerm.trim().toLowerCase();
  const [movies, setMovies] = useState([]); //holds array of movie data from omdb
  const [loading, setLoading] = useState(false); //tells when data is being fetched
  const [error, setError] = useState(""); //holds error message or no results message

  const [recentSearches, setRecentSearches] = useState(() => {
    const stored = localStorage.getItem("recentSearches");
    return stored ? JSON.parse(stored) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const matchingSuggestions = cleanSearchTerm
    ? recentSearches.filter((term) =>
        term.toLowerCase().includes(cleanSearchTerm)
      )
    : recentSearches;

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const formRef = useRef(null);
  // const [filteredMovies, setFilteredMovies] = useState([]); removed as it maybe the reason behind bug with brave new world

  const fetchMovies = async (query) => {
    setLoading(true);
    setError("");
    setMovies([]); //clear before starting fetch for extra safety
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=d11127cf&s=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search); // original full response
      } else {
        setMovies([]);
        setError("No results found");
      }
    } catch (err) {
      setMovies([]);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run once when the component first mounts
    fetchMovies("batman");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);

    if (event.target.value.trim()) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cleanSearchTerm) {
      setError("Please enter a movie name.");
      return;
    }
    setError("");
    setMovies([]); // ⬅️ Important: clear old results
    fetchMovies(cleanSearchTerm);

    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((term) => term !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const toggleFavorite = (movie) => {
    const isAlreadyFavorite = favorites.some(
      (fav) => fav.imdbID === movie.imdbID
    );
    let updatedFavorites;

    if (isAlreadyFavorite) {
      // Remove from favorites
      updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, movie];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="App">
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>
          Home
        </Link>
        <Link to="/favorites">Favorites</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Movie Search</h1>

              <form
                onSubmit={handleSubmit}
                ref={formRef}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                <SearchBar
                  placeholder="Search for a movie..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setIsDropdownVisible(true)}
                />

                {isDropdownVisible && matchingSuggestions.length > 0 && (
                  <ul className="search-dropdown">
                    {matchingSuggestions.map((term, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setSearchTerm(term);
                          fetchMovies(term);
                          setIsDropdownVisible(false);
                        }}
                      >
                        {term}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="submit"
                  className="search-button"
                  disabled={!searchTerm.trim() || loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </form>

              {loading && <Spinner />}
              {error && <p>{error}</p>}
              {!loading && movies.length === 0 && !error && (
                <p>Start searching for movies!</p>
              )}

              {!error && (
                <div className="movie-list">
                  {movies
                    .filter((movie) => {
                      const title = (movie.Title || "").toLowerCase();
                      return (
                        title.includes(cleanSearchTerm) &&
                        movie.Poster &&
                        movie.Poster !== "N/A"
                      );
                    })
                    .slice(0, 10)
                    .map((movie) => (
                      <MovieCard
                        key={movie.imdbID}
                        title={movie.Title}
                        year={movie.Year}
                        poster={movie.Poster}
                        isFavorite={favorites.some(
                          (fav) => fav.imdbID === movie.imdbID
                        )}
                        toggleFavorite={() => toggleFavorite(movie)}
                      />
                    ))}
                </div>
              )}
            </>
          }
        />

        <Route
          path="/favorites"
          element={
            <Favorites favorites={favorites} toggleFavorite={toggleFavorite} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
