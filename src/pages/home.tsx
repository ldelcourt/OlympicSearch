import Search from '../Component/Search';
import Header from '../Component/Header';
import { useEffect } from 'react';
import './home.css';

function Home() {

  useEffect(() => {
    document.title = "Olymp'IF - Accueil";
  }, []);

  return (
    <div className='home-container'>
      <Search></Search>
    </div>   
  );
}

export default Home;
