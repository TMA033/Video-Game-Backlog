import { useState } from 'react';
import Modal from '../../components/Modals/Modal';
import './RandomGameModal.css';


export default function RandomGameModal({isOpen, onClose, backlogGames}) {
  const [selectedGame, setSelectedGame] = useState(null);

  const notStartedGames = backlogGames.filter((game) => game.status === 'Not Started');
  const candidates = selectedGame ? notStartedGames.filter((game) => game.id !== selectedGame.id) : notStartedGames;

  const canRandomize = notStartedGames.length > 1;

  function getRandomGame() {
    if (candidates.length === 0) return;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    setSelectedGame(candidates[randomIndex]);
  }


  function handleClose() {
    setSelectedGame(null);
    if (onClose) onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='game-picker-container'>
        <div className='modal-title'>
          <h1>Random Game Selector</h1>
          <p className='header-info-text'>(Select's games from your "Not Started" category)</p>
        </div>

        {selectedGame ? 
          <div className='chosen-game'>
            <img className='selected-game-image' src={selectedGame ? selectedGame.image : null}></img>
            <p className='selected-game-title'>{selectedGame.title}</p>
            <p className='selected-game-release-date'>{selectedGame.release}</p>
            <p className='selected-game-hltb'>how long to beat here</p>
          </div>
        : 
          <div>
            <img className='question-mark-image' src='src/assets/question-mark-circle.png'></img>
          </div>
        }

        <button className='randomize-game-btn' disabled={!canRandomize} onClick={() => getRandomGame(backlogGames)}>
          {canRandomize ? 'Randomize Game' : 'Add 1 More Game To Randomize'}
        </button>
      </div>
    </Modal>
  )
}