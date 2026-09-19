import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from "../../components/Header";
import { GameGrid } from './GameGrid';
import ControllerIcon from '../../assets/Controller-Logo.png';
import './HomePage.css';


export function HomePage() {
  const [games, setGames] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');


  useEffect(() => {
    async function fetchGames() {

      try {
        console.log(search);

        const endpoint = search ? `http://localhost:5000/api/games/search?q=${encodeURIComponent(search)}` : `http://localhost:5000/api/games/popular`;

        const response = await fetch(endpoint);
        const rawData = await response.json();
        console.log("Raw Data from Server:", rawData);
        
        const formattedGames = rawData.map((game) => {
          const isUnreleased = game.first_release_date && (game.first_release_date * 1000 > Date.now());

          const formattedDate = game.first_release_date 
            ? new Date(game.first_release_date * 1000).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              }) 
            : 'TBA';

          return {
            id: game.id,
            title: game.name,
            slug: game.slug,
            score: game.rating ? Math.round(game.rating) : 'N/A',
            image: game.cover 
              ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` 
              : ControllerIcon,
            release: isUnreleased ? `RELEASING: ${formattedDate}` : formattedDate,
          };
        });

        setGames(formattedGames);
      } catch (error) {
        console.error('Error fetching games: ', error);
      }
    }

    fetchGames();
  }, [search]);

  return (
    <>
      <Header />

      
      <div className="homepage-container">
        <div className="sidebar"></div>

        <div className="main-content">
          <div className="content-header">
            <h1>{search ? `(${games.length}) Results for "${search}"` : 'Popular Games'}</h1>

            <div className="filter-bar">
              <div className="filters">
                <div className="dropdown">
                  Order by: <strong>Popularity</strong>
                </div>
                <div className="dropdown">Platforms</div>
              </div>
            </div>
          </div>

          <GameGrid games={games}/>
        </div>
      </div>
    </>
  );
}
