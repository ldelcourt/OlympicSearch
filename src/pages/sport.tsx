import React from 'react';
import './Sport.css';

interface SportProps {
  sportName: string;
  olympicAppearance: string;
}

function Sport({ sportName, olympicAppearance }: SportProps) {
  return (
    <div className="sport-container">
      <div className="info-container">
        <div className="info-text">
          <h2>Discipline : {sportName}</h2>
          <h2>Apparition aux JO : {olympicAppearance}</h2>
        </div>
        <img className="sport-image" src="../images/logoJO.png" alt="JO Logo" />
      </div>
      <div className="description-container">
        <p>Description : </p>
      </div>
    </div>
  );
}

export default Sport;
