import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home/HomePage';
import { GameDetails } from './pages/game details page/GameDetails';
import { EventsPage } from './pages/Events/EventsPage'
import { Library } from './pages/Library Page/Library';


function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="games/:slug" element={<GameDetails />} />
      <Route path="/events" element={<EventsPage />}/>
      <Route path="/library" element={<Library />}/>
    </Routes>
  )
}

export default App
