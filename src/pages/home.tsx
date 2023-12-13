import Search from '../Component/Search';
import Header from '../Component/Header';
import { useEffect } from 'react';
import './home.css';
import {Link} from 'react-router-dom';

function Home() {

  useEffect(() => {
    document.title = "Olymp'IF - Accueil";
  }, []);

  return (
    <>
      <div className="card">
        <p>
          Vous êtes prêts à tout savoir sur les JO ?
        </p>
        <Link to="/Sport/sport">Test page sport</Link><br/>
        <Link to="/athlete/athlete">Test page athlete</Link><br/>
        <Link to="/edition/edition">Test page edition</Link><br/>
        <button >
          Test page pays
        </button>
      </div>
      <p className="read-the-docs">    
        Clique sur les logos des Jeux Olympiques et Paralympiques pour en apprendre plus
      </p>
    <div className='home-container'>
      <Search></Search>
    </div>  
    </> 
  );
}

export default Home;
