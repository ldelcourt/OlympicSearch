import Search from '../Component/Search';
import { useEffect, useState } from 'react';
import './home.css';
import TableauVignettes from '../tableauVignette';
import { VignetteProps } from '../vignette';

function Home() {
  const [tableData, setTableData] = useState<VignetteProps[]>([]);
  useEffect(() => {
    document.title = "Olymp'IF - Accueil";
  }, []);


  return (
    <div className='home-container'>
      <div>
        <Search />
      </div>
    </div> 
  );
}

export default Home;
