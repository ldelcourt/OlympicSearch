import { useState } from 'react';
import './Search.css';

function Search() {
    const [count, setCount] = useState(0);
    
    return (
        
       <>
     <div className="search-container">
  <input type="text" id="search" placeholder="Rechercher..."></input>
  <button type="submit" id="search-button">
    <img src="https://cdn-icons-png.flaticon.com/256/3917/3917132.png" alt="Rechercher"></img>
  </button>
</div>
    </>
    );
  }
  export default Search;