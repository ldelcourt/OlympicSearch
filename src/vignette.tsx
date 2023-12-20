import React, { useState} from 'react';
import './vignette.css';
import { Link } from 'react-router-dom';

export interface VignetteProps {
  id?: string;
  title?: string;
  type: string;
  imageSrc?: string;
  description?: string;
}

function Vignette({ id, imageSrc, title, type, description }: VignetteProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const params = new URLSearchParams();
  params.append('title', title ?? "");
  params.append('type', type);

  const getLinkBasedOnType = (): string => {
    switch (type) {
      case 'Athlète':
        return `/athlete/${id}`;
      case 'Sport':
        return `/sport/${id}`
      case 'Pays':
        return `/pays/${id}`;
      case 'Edition':
        return `/edition/${id}`;
      default:
        return '/';
    }
  };

  const handleMouseEnter = () => {
    // Utilisation de la Promise et setTimeout
    const timerPromise = new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
        setShowDescription(true);
      }, 500);
    });

    // Mise à jour de l'état avec la résolution de la Promise
    timerPromise.then(() => {
      // Faites quelque chose après le délai si nécessaire
    });
  };

  const handleMouseLeave = () => {
    setShowDescription(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <Link to={getLinkBasedOnType()} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
      <div className="vignette-container">
        <img src={imageSrc} alt={title} className="vignette-image" />
        <div className="vignette-text">
          <h2 className="vignette-title">{title}</h2>
          <p className="vignette-type">{type}</p>
          {showDescription && <div className="vignette-description" style={{ top: cursorPosition.y, left: cursorPosition.x }}>{description}</div>}
        </div>
      </div>
    </Link>
  );
}

export default Vignette;
