function MovieCard({ title, year, poster, isFavorite, toggleFavorite }) {
  // 1) Simple fallbacks so the UI never breaks
  const safeTitle = title || "Unknown Title";
  const safeYear = year || "—";
  const safePoster =
    poster && poster !== "N/A" ? poster : "https://placehold.co/600x400/png";

  // 2) If the image URL 404s, swap to the fallback at runtime
  const handleImgError = (e) => {
    e.currentTarget.src = "https://placehold.co/600x400/png";
  };

  return (
    <div
      className="movie-card"
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        width: "200px",
        borderRadius: "8px",
      }}
    >
      <img
        src={safePoster}
        onError={handleImgError}
        alt={`${safeTitle} Poster`}
        style={{
          width: "100%",
          height: 300,
          objectFit: "cover",
          borderRadius: 6,
        }}
      />
      <h2>{safeTitle}</h2>
      <p>{safeYear}</p>

      <button onClick={toggleFavorite} className="favorite-btn">
        {isFavorite ? "★" : "☆"}
      </button>
    </div>
  );
}

export default MovieCard;
