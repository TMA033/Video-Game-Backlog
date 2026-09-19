import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home/HomePage';
import { GameDetails } from './pages/game details page/GameDetails';


function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="games/:slug" element={<GameDetails />} />
    </Routes>
  )
}

export default App
