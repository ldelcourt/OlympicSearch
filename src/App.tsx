import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://olympics.com/en/" target="_blank">
          <img
            src="https://www.mpa-pro.fr/resize/650x450/zc/2/f/0/src/sites/mpapro/files/products/d12592.png"
            className="logo react"
            alt="Olympic Games logo"
          />
        </a>
        <a href="https://www.paralympic.org/" target="_blank">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/IPC_logo_%282019%29.svg/800px-IPC_logo_%282019%29.svg.png"
            className="logo react"
            alt="Paralympic Games logo"
          />
        </a>
      </div>
      <h1>Olymp'IF</h1>
      <div className="card">
        <button >
          Explorer les éditions précédentes
        </button>
        <p>
          Vous êtes prêts à découvrir l'historique des JO ?
        </p>
      </div>
      <p className="read-the-docs">    
        Click on the Olympic and Paralympic logos to learn more
      </p>
    </>   
  );
}

export default App;
