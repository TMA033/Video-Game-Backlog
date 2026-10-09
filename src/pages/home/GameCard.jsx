import { Link } from "react-router-dom";

export function GameCard({ game, inBacklog, onToggleBacklog }) {

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Add to backlog logic will be here
    onToggleBacklog(game);
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
          
          <button className={` ${inBacklog ? 'in-backlog-button' : 'add-to-backlog-button'}`} onClick={handleClick} >
            {inBacklog ? "In Backlog" : "Add To Backlog"}
          </button>

        </div>
      </div>
    </Link>
  );
}
