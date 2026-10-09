import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react';
import ControllerIcon from '../assets/Controller-Logo.png';
import SearchIcon from '../assets/search-icon.svg'
import './Header.css';

export function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search');
  const [search, setSearch] = useState(searchText || '');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  function toggleNotifications() {
    setIsNotificationsOpen((prev) => !prev);
  }

  function updateSearchInput(event) {
    setSearch(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      searchGames();
    }
  }

  const searchGames = () => {
    navigate(`/?search=${search}`)
  }

  return (
    <div className="header">
      <div className="left-section-container">
        <NavLink to="/">
          <img className="main-logo" src={ControllerIcon}/>
        </NavLink>
      </div>


      <div className="middle-section">
        {/* Well insert the number of games with the API*/}
        <div className="search-bar-container">
          <img src={SearchIcon} className="search-icon" />
          <input type="search" className ="search-input" placeholder="Search games" onChange={updateSearchInput} onKeyDown={handleKeyDown}/>
        </div>
      </div>


      <div className="right-section">
        <div className="right-section-container">
          <NavLink to='/events' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Events
          </NavLink>

          <button type="button" className={`nav-link nav-btn ${isNotificationsOpen ? 'active' : ''}`} onClick={toggleNotifications}>
            Notifications
          </button>

          {/* Rendering the modal conditionally / style modal later */}

          {isNotificationsOpen && (
            <div className='notification-modal'>
              <p>No new notifications</p>
            </div>
          )}

          <NavLink to='/library' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            My Library
          </NavLink>

          <NavLink to='/profile' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Profile
          </NavLink>
        </div>
      </div>
    </div>
  )
}