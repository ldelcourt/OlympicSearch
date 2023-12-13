import Search from '../Component/Search';
import { useEffect } from 'react';
import './home.css';
import TableauVignettes from '../tableauVignette';

function Home() {

  useEffect(() => {
    document.title = "Olymp'IF - Accueil";
  }, []);

  return (
    <div className='home-container'>
      <div>
        <Search />
      </div>
      <TableauVignettes />
    </div> 
  );
}

export default Home;
