import React, { useState, useEffect } from 'react';
import './Vignette.css';
import { Link } from 'react-router-dom';
import { SearchType } from './interfaces';

export interface VignetteProps {
  id?: string;
  title?: string;
  type: string;
  imageSrc?: string;
  description?: string;
}

function Vignette({ id, imageSrc, title, type, description }: VignetteProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const params = new URLSearchParams();
  params.append('title', title);
  params.append('type', type);

  const getLinkBasedOnType = (): string => {
    // Ajoutez des conditions pour déterminer le lien en fonction du type
    if (type === 'Athlète') {
      return `/athlete/${id}`;
    } else if (type === 'Pays') {
      return `/pays/${id}`;
    } else if (type === 'Edition') {
      // Lien par défaut si le type n'est pas géré
      return `/edition/${id}`;
    } else if (type === 'Sport') {
      return `/sport/${id}`;
    } else {
      return `/?${params.toString()}`
    }
  };

  const handleMouseEnter = () => {
    const timerId = setTimeout(() => setShowDescription(true), 500);
    setTimer(timerId);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setShowDescription(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

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
