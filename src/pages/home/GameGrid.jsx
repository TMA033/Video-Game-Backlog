import { GameCard } from "./GameCard";

export function GameGrid( {games} ) {
  return (
    <div className="game-grid">
      {games.map((game) => {
        return (
          <GameCard key={game.id} game={game}/>
        );
      })}
    </div>
  );
}
