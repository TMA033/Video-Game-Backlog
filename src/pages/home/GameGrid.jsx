import { GameCard } from "./GameCard";
import { useLibraryContext } from "../../hooks/LibraryContext";

export function GameGrid( {games} ) {
  const { toggleBacklog, isInBacklogCheck } = useLibraryContext();

  return (
    <div className="game-grid">
      {games.map((game) => {
        return (
          <GameCard key={game.id} game={game} inBacklog={isInBacklogCheck(game.id)} onToggleBacklog={toggleBacklog}/>
        );
      })}
    </div>
  );
}
