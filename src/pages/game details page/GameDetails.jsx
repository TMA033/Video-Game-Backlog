import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Header } from '../../components/Header';
import leftArrow from '../../assets/left-arrow-svgrepo-com.svg';
import rightArrow from '../../assets/right-arrow-svgrepo-com.svg';
import './GameDetails.css';

export function GameDetails() {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0); // This is the index of the currently focused media
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { slug } = useParams();

  const [timeLeft, setTimeLeft] = useState(null);

  const scrollRef = useRef(null);
  const activeThumbRef = useRef(null);



  useEffect(() => {
    async function fetchGameDetails() {
      try {
        setLoading(true);

        const res =  await fetch(`http://localhost:5000/api/games/${slug}`);

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setGame(data);
        console.log(data); // delete this later, its just for showing me what response i am given

      } catch (err) {
        console.error('Failed to load game:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchGameDetails();
    }

  }, [slug]);


  useEffect(() => {
    const el = scrollRef.current;
    if(!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, {passive: false});

    return () => {
      el.removeEventListener('wheel', onWheel);
    }
  }, [game]);


  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeMediaIndex]);


  useEffect(() => {
    if (!game || !game.releaseTimestamp) return;

    let timer;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = game.releaseTimestamp - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor ((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null); // When timer hits 0, remove it
        if (timer) {
          clearInterval(timer);
        }
      }
    };

    // Runs immediately on mount, then counts down every second
    calculateTimeLeft();

    // Prevents starting an interval if date has passed. 
    if (game.releaseTimestamp > Date.now()) {
      timer = setInterval(calculateTimeLeft, 1000);
    }

    // Cleanup function to prevent memory leaks
    return () => clearInterval(timer);
  }, [game])

  
  // Combine videos and screenshot into a single list
  const mediaItems = game ? [
    ...(game.videos || []).map((vid) => ({
      type: 'video',
      src: vid.embedUrl,
      thumbnail: vid.thumbnail,
      videoId: vid.id,
      id: `vid-${vid.id}`
    })),
    ...(game.screenshots || []).map((shot, idx) => ({
      type: 'image',
      src: shot.full,
      thumbnail: shot.thumb,
      id: `shot-${idx}`
    }))
  ] : [];

  const activeMedia = mediaItems[activeMediaIndex];

  if (loading) return <div>Loading game details...</div>;
  if (!game) return <div>Game Not Found</div>


  return (
    <>
      <Header />

      <div className="game-details-page">
        {game.releaseTimestamp > new Date().getTime() 
        ?
          <div className="release-countdown-container">
            <div className='release-countdown'>
              <div className='days-countdown'>
                <p>{10}</p>
                <p>DAYS</p>
              </div>

              <div className='days-countdown'>
                <p>{5}</p>
                <p>HOURS</p>
              </div>

              <div className='days-countdown'>
                <p>{40}</p>
                <p>MINUTES</p>
              </div>

              <div className='days-countdown'>
                <p>{30}</p>
                <p>SECONDS</p>
              </div>
            </div>
          </div>
        : null
        }

        <header>
          <h1 className="game-title">{game.name}</h1>
        </header>

        {/* Main Showcase Section */}
        <div className="showcase-container">
          <div className="media-gallery">
            <div className="spotlight-frame">
              <div className='gallery-controls'>
                <img src={leftArrow} className='arrow-keys' onClick={() => setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1))}/>
                <img src={rightArrow} className='arrow-keys' onClick={() => setActiveMediaIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0))} />
              </div>

              {activeMedia?.type === 'video' ? (
                <iframe 
                  src={activeMedia.src}
                  className="spotlight-media"
                  allowFullScreen
                />
              ) : (
                <img
                  src={activeMedia?.src || game.coverUrl}
                  className="spotlight-media spotlight-media-image"
                  onClick={() => setIsFullscreen(true)}
                />
              )}
            </div>

            <div className="thumbnail-strip" ref={scrollRef} >
              {/* Videos */}
              {/* RIGHT HERE WE WILL MAP mediaItems array*/}
              {mediaItems.map((item, idx) => {
                const isActive = activeMediaIndex === idx;

                return (
                <button
                  key={item.id}
                  ref={isActive ? activeThumbRef : null}
                  type="button"
                  className={`thumbnail-btn ${item.type === 'video' ? 'video-thumb' : ''} ${activeMediaIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveMediaIndex(idx)}
                >
                  <img src={item.thumbnail} alt={`Thumbnail ${idx + 1}`}/>
                </button>
              )})}
            </div>
          </div>


          <div className="summary-card">
            {game?.cover?.full && (
              <div className="summary-banner">
                <img src={game.cover.full} alt={`${game.name || 'Game'} cover`}/>
              </div>
            )}

            <p className='summary-description'>
              {game.summary || 'No summary available for this title.'}
            </p>

            <div className='meta-details'>
              <div className='meta-row'>
                {game.rating && (
                <div>
                  <span className="meta-label">IGDB Rating: </span>
                  <span className="meta-value rating-highlight">
                    {game.rating}% ({game.ratingCount} reviews)
                  </span>
                </div>
                )}
              </div>

              <div className='meta-row'>
                <span className='meta-label'>Release Date: </span>
                <span className='meta-value'>{game.releaseDate}</span>
              </div>

              {game.developers.length > 0 && (
                <div className="meta-row">
                  <span className='meta-label'>Developers: </span>
                  <span className='meta-value link-highlight'>{game.developers.join(', ')}</span>
                </div>
              )}

              {game.publishers.length > 0 && (
                <div className='meta-row'>
                  <span className="meta-label">Publishers: </span>
                  <span className="meta-value link-highlight">{game.publishers.join(', ')}</span>
                </div>
              )}

              {game.genres.length > 0 && (
                <div className="tags-section">
                  <span className='tags-title'>Genres of this game</span>
                  <div className='tag-list'>
                    {game.genres.map((genre, idx) => (
                      <span key={idx} className="tag-badge">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isFullscreen && (
        <div className='fullscreen-media-container' onClick={() => setIsFullscreen(false)}>
          <button type="button" className='close-button' onClick={() => setIsFullscreen(false)}>x</button>
          <div className='fullscreen-wrapper' onClick={(e) => e.stopPropagation()}>
            <div className='gallery-controls-fullscreen'>
                <img src={leftArrow} className='arrow-keys-fullscreen' onClick={() => setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1))}/>
                <img src={rightArrow} className='arrow-keys-fullscreen' onClick={() => setActiveMediaIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0))} />
              </div>
            {activeMedia.type === 'video' ? (
              <iframe src={activeMedia.src} className="fullscreen-video" allowFullScreen/>
            ) : 
              <img src={activeMedia?.src || game.coverUrl} className='fullscreen-image'/>
            }
          </div>
        </div>
      )}
    </>
  )
}