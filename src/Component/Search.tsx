import { useState } from 'react';
import './Search.css';

function Search() {
    const [count, setCount] = useState(0);
    return (
        
       <>
     <div className="search-container">
  <input type="text" id="search" placeholder="Rechercher..."></input>
  <button type="submit" id="search-button">
    <img src="../assets/loupe.svg" alt="Rechercher"></img>
  </button>
</div>
    </>
    );
  }
  export default Search;