import './sport.css';

interface SportProps {
    sportName?: string;
    olympicAppearance?: string;
    sportImageSource?: string;
    sportDescription?: string;
  }

function Sport({
    sportName,
    olympicAppearance,
    sportImageSource,
    sportDescription,
  }: SportProps) {
    return (
      <div className="sport-container">
        <div className="info-container">
          <div className="info-text">
            <p>Discipline: {sportName}</p>
            <p>Apparition aux JO: {olympicAppearance}</p>
          </div>
          <img className="sport-image" src={sportImageSource} alt="Sport" />
        </div>
        <div className="description-container">
          <p>{sportDescription}</p>
        </div>
      </div>
    );
  }

export default Sport;