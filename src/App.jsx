  import { useState, useEffect } from 'react';
  import SearchBar from './components/SearchBar';
  import MovieCard from './components/MovieCard';
  import Spinner from './components/Spinner';
  import './App.css';

  function App() {
    //we will create 4 pieces of state
    const [searchTerm, setSearchTerm] = useState(''); //stores user input
    const [movies, setMovies] = useState([]); //holds array of movie data from omdb
    const [loading, setLoading] = useState(false); //tells when data is being fetched
    const [error, setError] = useState(''); //holds error message or no results message
    const [recentSearches, setRecentSearches] = useState(() => {
      const stored = localStorage.getItem('recentSearches');
      return stored ? JSON.parse(stored) : [];
    });

    const fetchMovies = async (query) => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=d11127cf&s=${encodeURIComponent(query)}`)
        const data = await response.json();

        if (data.Response === 'True') {
          setMovies(data.Search);
        } else {
          setMovies([]);
          setError('No results found');
        }
      } catch (err) {
        setError('Something went wrong');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      // Run once when the component first mounts
      fetchMovies('batman');
    }, []);


    const handleSearch = (event) => {
      setSearchTerm(event.target.value);

      if (event.target.value.trim()) {
        setError('');
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!searchTerm.trim()) {
        setError('Please enter a movie name.');
        return;
      }
      setError(''); //clear old error if user fixes it
      fetchMovies(searchTerm);
      
      const updatedSearches = [searchTerm, ...recentSearches.filter(term => term!== searchTerm)].slice(0,5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } 

    const filteredMovies = movies.filter((movie) => {
      const title = (movie.Title || '').toLowerCase();
      return title.includes(searchTerm.toLowerCase());
    }
    );
    return (
      <div className="App">
        <h1>Movie Search</h1>
        
        <form onSubmit={handleSubmit}>
          <SearchBar
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={handleSearch}
          />

          <button
            type="submit"
            className="search-button"
            disabled={!searchTerm.trim() || loading}
          >
            {loading ? 'Searching...' : 'Search'} 
            {/* i really like what u did on line above. conditional rendering even inside the search button. that way when its loading, the text inside tells you that its loading */}
          </button>
        </form>

        {recentSearches.length > 0 && (
  <div className="recent-searches">
    <p>Recent:</p>
    <ul>
      {recentSearches.map((term, i) => (
        <li key={i}>
          <button onClick={() => {
            setSearchTerm(term);
            fetchMovies(term);
          }}>
            {term}
          </button>
        </li>
      ))}
    </ul>
  </div>
)}



        {/* Below are 3 examples of conditional rendering of UI */}
        {loading && <Spinner />}
        {error && <p>{error}</p>}
        {!loading && movies.length === 0 && !error && (<p>Start searching for movies!</p>)}


        <div className="movie-list">
        {filteredMovies.slice(0,10).map((movie) => (
          <MovieCard
            key={movie.imdbID}
            title={movie.Title}
            year={movie.Year}
            poster={movie.Poster}
          />
        ))}
        </div>
      </div>
    );
  }


  export default App;
