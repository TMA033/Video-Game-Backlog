import { GameCard } from "./GameCard";
import { useLibrary } from "../../hooks/useLibrary";

export function GameGrid( {games} ) {
  const { toggleBacklog, isInBacklogCheck } = useLibrary();

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
