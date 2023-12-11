import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {

    const navigate = useNavigate();
    
    return (
        
       <>
    <header>
        <img src="https://www.mpa-pro.fr/resize/650x450/zc/2/f/0/src/sites/mpapro/files/products/d12592.png" alt="Logo" onClick={() => navigate('..')} ></img>
        <h1 onClick={() => navigate('..')}>Olymp'IF</h1>
    </header>
    </>
    );
  }
  export default Header;
