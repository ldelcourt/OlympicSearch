import { ChangeEvent, useState } from "react";
import "./Search.css";

function Search() {
  const [texteSaisie, setTexteSaisie] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTexteSaisie(event.target.value);
  };

  const handleClick = (): void => {
    alert(texteSaisie);
  };

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          id="search"
          value={texteSaisie}
          onChange={handleChange}
          placeholder="Rechercher..."
        />
        <button onClick={handleClick} type="submit" id="search-button">
          <img
            src="https://cdn-icons-png.flaticon.com/256/3917/3917132.png"
            alt="Rechercher"
          ></img>
        </button>
      </div>
    </>
  );
}
export default Search;
