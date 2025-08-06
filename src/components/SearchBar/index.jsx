function SearchBar({ placeholder, value, onChange }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        padding: '10px',
        width: '300px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
      }}
    />
  );
}

export default SearchBar;
