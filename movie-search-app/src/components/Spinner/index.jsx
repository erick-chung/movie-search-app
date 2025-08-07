function Spinner() {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite" aria-label="Loading">
      <div className="spinner" />
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}

export default Spinner;
