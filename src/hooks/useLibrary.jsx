import {useState, useEffect } from 'react';

export function useLibrary() {
  const [library, setLibrary] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('users_game_library')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('users_game_library', JSON.stringify(library));
    console.log(library);
  }, [library]);

  const toggleBacklog = (game) => {
    setLibrary((prev) => {
      const exists = prev.some((item) => item.id === game.id);
      if (exists) return prev.filter((item) => item.id !== game.id);

      return [...prev, {
        id: game.id,
        title: game.name || game.title,
        slug: game.slug,
        score: game.rating ? Math.round(game.rating) : 'N/A',
        image: game.cover?.full || game.coverUrl || game.image,
        release: game.releaseDate || game.release || 'TBA',
        status: 'Not Started',
        addedAt: Date.now(),
      }];
    });
  };

  const isInBacklogCheck = (id) => library.some((item) => item.id === id);

  return { library, toggleBacklog, isInBacklogCheck };
}