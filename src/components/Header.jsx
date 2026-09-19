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
          <div>Notifications</div>
          <div>My Library</div>
          <div>Profile</div>
        </div>
      </div>
    </div>
  )
}