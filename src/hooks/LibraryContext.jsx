import { createContext, useContext, useEffect, useState } from "react";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState(() => {
    try {
      const savedLibrary = localStorage.getItem("users_game_library");
      return savedLibrary ? JSON.parse(savedLibrary) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("users_game_library", JSON.stringify(library));
  }, [library]);

  const toggleBacklog = (game) => {
    setLibrary((prev) => {
      const exists = prev.some((item) => item.id === game.id);

      if (exists) {
        return prev.filter((item) => item.id !== game.id);
      }

      return [
        ...prev,
        {
          id: game.id,
          title: game.name || game.title,
          slug: game.slug,
          score: game.rating ? Math.round(game.rating) : "N/A",
          image: game.cover?.full || game.coverUrl || game.image,
          release: game.releaseDate || game.release || "TBA",
          status: "Not Started",
          addedAt: Date.now(),
        },
      ];
    });
  };

  const isInBacklogCheck = (id) =>
    library.some((item) => item.id === id);

  const value = {
    library,
    setLibrary,
    toggleBacklog,
    isInBacklogCheck,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibraryContext() {
  const context = useContext(LibraryContext);

  if (context === null) {
    throw new Error(
      "useLibraryContext must be used within a LibraryProvider"
    );
  }

  return context;
}