import React from 'react';
import './Sport.css';

interface SportProps {
  sportName: string;
  olympicAppearance: string;
}

function Sport() {
  return (
    <>
    <div className="container-sport">
      <div className='ligne-haut'>
        <div className="info-container">
          <p>Discipline : </p>
          <p><br/>Apparition aux JO : </p>
        </div>
        <img className="image" src="https://svgsilh.com/svg_v2/40795.svg" alt="JO Logo" />
      </div>     
      <div className="description-container">
        <p>Description : </p>
      </div>
    </div>
    </>
  );
}

export default Sport;
