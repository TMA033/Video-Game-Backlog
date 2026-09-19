// NOT USED

import {useState, useRef, useEffect} from 'react';

export function YoutubePlayer({ videoId }) {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let player;

    function createPlayer() {
      if (!playerContainerRef.current) return;
      player = new window.YT.Player(playerContainerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
          },

          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            }

            if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          },
        }

      })
    }

    // YouTube API is already loaded
    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Check if the script is already being loaded
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.src = "https://www.youtube.com/iframe_api";

        document.body.appendChild(script);
      }

      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (player) {
        player.destroy();
      }

      playerRef.current = null;
    }
  }, [videoId]);


  function togglePlay() {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }

  return (
    <div className='youtube-player'>
      <div ref={playerContainerRef} className='spotlight-media'></div>
      <div className='video-controls'>
        <button onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  )
}