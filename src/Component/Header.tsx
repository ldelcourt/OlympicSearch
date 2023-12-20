import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {

    const navigate = useNavigate();
    
    return (
        
       <>
    <header>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Olympic_rings_without_rims.svg/langfr-1920px-Olympic_rings_without_rims.svg.png" alt="Logo"></img>
        <h1 onClick={() => navigate('..')}>Olymp'IF</h1>
        <div className="header-right">
            <div className='linkk' onClick={() => navigate('/team')}>Team</div>
        </div>
    </header>
    </>
    );
  }
  export default Header;
