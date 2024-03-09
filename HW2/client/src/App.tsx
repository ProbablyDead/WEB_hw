import {useState} from 'react';
import './App.css';

import StartMenuPage from './components/Menu/StartMenuPage';
import MultiplayerMenuPage from './components/Menu/MultyplayerMenuPage';
import GamePage from './components/Game/GamePage';
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
  player1: PlayerProps;
  player2: PlayerProps;
}

function App() {
  const errorMessage = "Got 'undefined' while unwrapping players' info";

  const [AppState, setAppState] = useState<AppState>({page: "startMenu"});
  const [Players, setPlayers] = useState<Players>();

  const setPlayersCall = (player1: PlayerProps, player2: PlayerProps) => {setPlayers({player1, player2})};

  const setGame = () => {setAppState({page: "game"})};
  const setStartMenu = () => {setAppState({page: "startMenu"})};
  const setMultyplayer = () => {setAppState({page: "multyplayerMenu"})};

  switch (AppState.page) {
  case "startMenu":
   return StartMenuPage({
     multyplayerOnClick: setMultyplayer, 
     singleOnClick: setGame,
     setPlayers: setPlayersCall
     });
  case "multyplayerMenu":
    return MultiplayerMenuPage({
      createOnClick: setGame, 
      joinOnClick: setGame,
      backOnClick: setStartMenu,
      setPlayers: setPlayersCall
    }
   );
  case "game":
    if (Players !== undefined) {
      return GamePage({Player1: Players.player1, Player2: Players.player2});
    } else {
      setAppState({page: "error"})
      return null;
    }
  case "error":
    return ErrorPage({message: errorMessage, backOnClick: setStartMenu});
  }; 
}

export default App;
