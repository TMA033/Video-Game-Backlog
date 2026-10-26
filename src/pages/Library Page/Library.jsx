import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { BacklogColumn } from "./BacklogColumn";
import { useLibraryContext } from "../../hooks/LibraryContext";
import { RecommendedGames } from "./RecommendedGames";
import RandomGameModal from './RandomGameModal.jsx';
import "./Library.css";

const STATUS_COLUMNS = [
  { key: "Currently Playing", label: "Currently Playing" },
  { key: "Not Started", label: "Not Started" },
  { key: "Completed", label: "Completed" },
];

export function Library() {
  const { library, setLibrary } = useLibraryContext();

  const [draggingGameId, setDraggingGameId] = useState(null);
  const [activeDropZone, setActiveDropZone] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("users_game_library", JSON.stringify(library));
  }, [library]);

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e, gameId) => {
    e.dataTransfer.setData("gameId", gameId.toString());
    e.dataTransfer.effectAllowed = "move";
    setDraggingGameId(gameId);
  };

  const handleDragEnd = () => {
    setDraggingGameId(null);
    setActiveDropZone(null);
  };

  const handleDragOver = (e, sectionName) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (activeDropZone !== sectionName) {
      setActiveDropZone(sectionName);
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setActiveDropZone(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const gameId = parseInt(e.dataTransfer.getData("gameId"), 10);

    setLibrary((prevLibrary) =>
      prevLibrary.map((game) =>
        game.id === gameId ? { ...game, status: targetStatus } : game
      )
    );

    setDraggingGameId(null);
    setActiveDropZone(null);
  };

  const handleRemoveGame = (gameId) => {
    setLibrary((prevLibrary) => prevLibrary.filter((game) => game.id !== gameId));
  };

  

  const handleClearShelf = (statusKey) => {
    setLibrary((prevLibrary) => 
      prevLibrary.filter((game) => {
        const gameStatus = game.status || 'Not Started';
        return gameStatus !== statusKey;
      })
    );
  }

  const onCloseModal = () => {
    setIsOpen(false);
  }

  const notStartedCount = library.filter((game) => !game.status || game.status === "Not Started").length;
  const canRandomize = notStartedCount > 1;
  
  return (
    <>
      <Header />

      <main className="main-content">
        <header className="content-header">
          <h1>Your Library</h1>
          <div className="helper-container">
            <div>Need Help Choosing A Game?</div>
            <div className="action-buttons">
              <button
                type="button" className="dice-btn" disabled={!canRandomize} onClick={() => setIsOpen(true)} aria-label="Pick a random game from your backlog"
                title={
                  canRandomize
                    ? "Pick a random game"
                    : "Need at least 2 unstarted games to roll"
                }
              >
                <img className="dice-image" src="src/assets/dice.png" alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <RandomGameModal isOpen={isOpen} onClose={onCloseModal} backlogGames={library}/>

        {/* 1. Backlog Shelves */}
        <section className="backlog-main-content">
          {STATUS_COLUMNS.map(({ key, label }) => {
            const games = library.filter((game) =>
              key === "Not Started"
                ? !game.status || game.status === "Not Started"
                : game.status === key
            );

            return (
              <BacklogColumn
                key={key}
                statusKey={key}
                label={label}
                games={games}
                isActiveDropZone={activeDropZone === key}
                draggingGameId={draggingGameId}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onRemove={handleRemoveGame}
                onClearAll={handleClearShelf}
              />
            );
          })}
        </section>

        <section className="recommended-section">
          <h2>Recommended For You</h2>

          <RecommendedGames library={library}/>
        </section>
      </main>
    </>
  );
}