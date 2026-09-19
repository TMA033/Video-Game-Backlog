import { Link } from "react-router-dom";


export function GameCard({ game }) {

  const handleAddToBackLog = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`Added ${game.title} to backlog!`);
  }

  return (
    <Link to={`/games/${game.slug}`} className="game-card-link">
      <div className="game-card">
        <div className="card-thumb">
          <img className="game-image" src={game.image}></img>
        </div>

        <div className="card-info">
          <div className="card-top-row">
            {game.score !== "N/A" && (
              <span
                className={`score-badge ${game.score >= 80 ? "high" : "medium"}`}
              >
                {game.score}
              </span>
            )}
          </div>

          <div className="card-title-details">
            <h3>{game.title}</h3>
            <p className="release-date">{game.release}</p>
          </div>
          
          <button className="add-to-backlog" onClick={handleAddToBackLog}>Add To Backlog</button>

        </div>
      </div>
    </Link>
  );
}
