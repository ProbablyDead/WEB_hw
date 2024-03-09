import React from 'react';
import Menu from './Menu/Menu';

import PlayerProps from '../../ts/interfaces/Player.interface';
import Player from '../../ts/classes/Player.class';

interface StartMenuPageProps {
  multyplayerOnClick: () => void;
  singleOnClick: () => void;
  setPlayers: (player1: PlayerProps, player2: PlayerProps) => void;
}

function createPlayers(setPlayers: (player1: PlayerProps, player2: PlayerProps) => void, singleOnClick: () => void) {
  setPlayers(new Player("Pupa"), new Player("Lupa"));
  singleOnClick();
}

const StartMenuPage: React.FC<StartMenuPageProps> = 
  ({multyplayerOnClick, singleOnClick, setPlayers}) => {
  return (
      <Menu buttons={[
        {title: "Multiplayer", onClick: multyplayerOnClick},
        {title: "Single play", onClick: () => createPlayers(setPlayers, singleOnClick)}
      ]}/>
    );
  };

export default StartMenuPage;
