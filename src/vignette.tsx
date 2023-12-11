import React, { useState, useEffect } from 'react';
import './Vignette.css';
import { Link } from 'react-router-dom';

interface VignetteProps {
  id: string;
  imageSrc: string;
  title: string;
  type: string;
  description: string;
}

function Vignette({ id, imageSrc, title, type, description }: VignetteProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const params = new URLSearchParams();
  params.append('title', title);
  params.append('type', type);

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
    <Link to={`/?${params.toString()}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
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
