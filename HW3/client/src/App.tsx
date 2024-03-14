import {useState} from 'react';
import styles from "./App.module.css";

import StartMenuPage from './components/Menu/StartMenuPage';
import MultiplayerMenuPage from './components/Menu/MultyplayerMenuPage';
import Game from './components/Game/Game';
import ErrorPage from './components/Error/ErrorPage';

import StartMenuState from './ts/interfaces/states/StartMenuState.interface';
import MultyplayerMenuState from './ts/interfaces/states/MultyplayerMenuState.interface';
import GameState from './ts/interfaces/states/GameState.interface';
import ErrorState from './ts/interfaces/states/ErrorState.interface';

import PlayerProps from './ts/interfaces/Player.interface';

type PageName = (
  StartMenuState | MultyplayerMenuState | GameState | ErrorState
)["page"];

interface AppState {
  page: PageName
};

interface Players {
  user: PlayerProps;
  opponent: PlayerProps;
}

function App() {
  const errorMessage = "Got 'null' while unwrapping players' info";

  const [AppState, setAppState] = useState<AppState>({page: "startMenu"});
  const [Players, setPlayers] = useState<Players | null>(null);

  const setPlayersCall = (players: Players | null) => {setPlayers(players)};

  const setGame = () => {setAppState({page: "game"})};
  const setStartMenu = () => {setAppState({page: "startMenu"})};
  const setMultyplayer = () => {setAppState({page: "multyplayerMenu"})};

  let currentPage;
  
  switch (AppState.page) {
  case "startMenu":
    currentPage = <StartMenuPage
      multyplayerOnClick={setMultyplayer}
      singleOnClick={setGame}
      setPlayers={setPlayersCall}
    />;
    break;
  case "multyplayerMenu":
    currentPage = <MultiplayerMenuPage
      toGame={setGame}
      backOnClick={setStartMenu}
      setPlayers={setPlayersCall}
    />;
    break;
  case "game":
    if (Players !== null) {
      currentPage = <Game
        returnToStartCallBack={setStartMenu}
        players={Players}
      />;
    } else {
      setAppState({page: "error"})
      currentPage = null;
    }
    break;
  case "error":
    currentPage = <ErrorPage 
      message={errorMessage}
      backOnClick={setStartMenu}
    />;
    break;
  }; 

  return (
  <div className={styles.app}>
    {currentPage}
  </div>
  );
}

export default App;
