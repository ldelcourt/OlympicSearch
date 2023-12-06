import React from 'react';
import './Vignette.css';
import { Link } from 'react-router-dom';

interface VignetteProps {
  imageSrc: string;
  title: string;
  type: string;
}

function Vignette({ imageSrc, title, type }: VignetteProps) {
    const params = new URLSearchParams();
    params.append('title', title);
    params.append('type', type);

  return (
    <Link to={`/?${params.toString()}`}>
        <div className="vignette-container">
          <img src={imageSrc} alt={title} className="vignette-image" />
          <div className="vignette-text">
            <h2 className="vignette-title">{title}</h2>
            <p className="vignette-type">{type}</p>
          </div>
        </div>
      </Link>
    );
  }

export default Vignette;