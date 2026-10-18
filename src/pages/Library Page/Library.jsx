import { useState } from 'react';

import { Header } from '../../components/Header';

export function Library() {
  let [library, setLibrary] = useState(() => {
    try{

      return JSON.parse(localStorage.getItem('users_game_library')) || [];
    } catch {
      return [];
    }
  })

  
  return (
    <>
      <Header />

      <div>

      </div>
    </>

  )
}