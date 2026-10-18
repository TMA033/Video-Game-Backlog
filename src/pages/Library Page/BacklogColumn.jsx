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
  onClearAll
}) {




  return (
    <div
      className={`backlog-column ${isActiveDropZone ? "drop-active" : ""}`}
      onDragOver={(e) => onDragOver(e, statusKey)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, statusKey)}
    >
      <div className='column-top'>
        <h2>
          {label} ({games.length})
        </h2>

        <button className="clear-all-btn" onClick={() => onClearAll(statusKey)}>CLEAR ALL</button>
      </div>

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