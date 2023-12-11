import { useNavigate } from 'react-router-dom';
import './Header.css';
import './Header.css';

function Header() {

    const navigate = useNavigate();
    
    return (
        
       <>
    <header>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Olympic_rings_without_rims.svg/langfr-1920px-Olympic_rings_without_rims.svg.png" alt="Logo"></img>
        
        

        <h1 onClick={() => navigate('..')}>Olymp'IF</h1>

    </header>
    </>
    );
  }
  export default Header;
