import Search from '../Component/Search';
import Header from '../Component/Header';
import React, { useEffect } from 'react';
import './home.css';
import {Link} from 'react-router-dom';

function Home() {

  useEffect(() => {
    document.title = "Olymp'IF - Accueil";
  }, []);

  return (
    <>
      <div className='logojo'>
        <a href="https://olympics.com/en/" target="_blank">
          <img
            src="https://www.mpa-pro.fr/resize/650x450/zc/2/f/0/src/sites/mpapro/files/products/d12592.png"
            className="logo react"
            alt="Olympic Games logo"
          />
        </a>
        <h1>Olymp'IF</h1>
        <a href="https://www.paralympic.org/" target="_blank">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/IPC_logo_%282019%29.svg/800px-IPC_logo_%282019%29.svg.png"
            className="logo react"
            alt="Paralympic Games logo"
          />
        </a>
      </div>
      <p> </p>
      <div className="card">
        <p>
          Vous êtes prêts à tout savoir sur les JO ?
        </p>
        <button >
          Test page athlete
        </button>
        <Link to="/sport">Test page sport</Link>
        <button >
          Test page edition
        </button>
        <button >
          Test page pays
        </button>
      </div>
      <p className="read-the-docs">    
        Clique sur les logos des Jeux Olympiques et Paralympiques pour en apprendre plus
      </p>
      <Search></Search>
    </>   
  );
}

export default Home;
