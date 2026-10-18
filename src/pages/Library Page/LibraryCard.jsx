export function LibraryCard({ game, isDragging, onDragStart, onDragEnd, onRemove }) {
  return (
    <div
      className={`game-card-mini ${isDragging ? "is-dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, game.id)}
      onDragEnd={onDragEnd}
    >
      <div className="card-mini-thumb">
        <img src={game.image} alt={game.title} />
      </div>

      <div className="card-mini-info">
        <span className="card-mini-title" title={game.title}>
          {game.title}
        </span>
        <button
          type="button"
          className="btn-mini-remove"
          onClick={() => onRemove(game.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}