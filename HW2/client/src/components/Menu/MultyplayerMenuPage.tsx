import React from 'react';
import Menu from './Menu/Menu';

import PlayerProps from '../../ts/interfaces/Player.interface';

interface MultiplayerMenuPageProps {
  createOnClick: () => void;
  joinOnClick: () => void;
  backOnClick: () => void;
  setPlayers: (player1: PlayerProps, player2: PlayerProps) => void;
}

const MultiplayerMenuPage: React.FC<MultiplayerMenuPageProps> = 
  ({createOnClick, joinOnClick, backOnClick, setPlayers}) => {
  return (
      <Menu buttons={[
        {title: "Create game", onClick: createOnClick},
        {title: "Join game", onClick: joinOnClick},
        {title: "Back", onClick: backOnClick}
        ]}/>
    );
  };

export default MultiplayerMenuPage;
