import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { BacklogColumn } from "./BacklogColumn";
import { RecommendedGames } from "./RecommendedGames";
import "./Library.css";

const STATUS_COLUMNS = [
  { key: "Currently Playing", label: "Currently Playing" },
  { key: "Not Started", label: "Not Started" },
  { key: "Completed", label: "Completed" },
];

export function Library() {
  const [library, setLibrary] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("users_game_library")) || [];
    } catch {
      return [];
    }
  });

  const [draggingGameId, setDraggingGameId] = useState(null);
  const [activeDropZone, setActiveDropZone] = useState(null);

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
    setLibrary((prevLibrary) => {
      prevLibrary.filter((game) => {
        const gameStatus = game.status || "Not Started";
        return gameStatus !== statusKey;
      })
    })
  }

  return (
    <>
      <Header />

      <main className="main-content">
        <header className="content-header">
          <h1>Your Library</h1>
        </header>

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