import { useState } from 'react';
import './Header.css';

function Header() {
    const [count, setCount] = useState(0);
    
    return (
        
       <>
    <header>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Olympic_rings_with_white_rims.svg/220px-Olympic_rings_with_white_rims.svg.png" alt="Logo"></img>
        <h1>Olymp'IF</h1>
        
        
    </header>
    </>
    );
  }
  export default Header;
