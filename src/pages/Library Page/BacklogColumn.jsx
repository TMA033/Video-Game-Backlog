import { LibraryCard } from './LibraryCard'

export function BacklogColumn({
  statusKey,
  label,
  games,
  isActiveDropZone,
  draggingGameId,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  onRemove,
}) {
  return (
    <div
      className={`backlog-column ${isActiveDropZone ? "drop-active" : ""}`}
      onDragOver={(e) => onDragOver(e, statusKey)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, statusKey)}
    >
      <h2>
        {label} ({games.length})
      </h2>

      <div className="card-list">
        {games.length === 0 ? (
          <div className="empty-placeholder">Drag games here</div>
        ) : (
          games.map((game) => (
            <LibraryCard
              key={game.id}
              game={game}
              isDragging={draggingGameId === game.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
}