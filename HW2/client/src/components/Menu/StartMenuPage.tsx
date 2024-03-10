import React from "react";
import Menu from "./Menu/Menu";

import PlayerProps from "../../ts/interfaces/Player.interface";
import Player from "../../ts/classes/Player.class";
import Bot from "../../ts/classes/Bot.class";

interface StartMenuPageProps {
  multyplayerOnClick: () => void;
  singleOnClick: () => void;
  setPlayers: (players: {user: PlayerProps, opponent: PlayerProps} | null) => void;
}

function createPlayers(setPlayers: (players: {user: PlayerProps, opponent: PlayerProps} | null) => void, singleOnClick: () => void) {
  setPlayers({user: new Player("You"), opponent: new Bot("Bot")});
  singleOnClick();
}

const StartMenuPage: React.FC<StartMenuPageProps> = 
  ({multyplayerOnClick, singleOnClick, setPlayers}) => {
  setPlayers(null);

  return (
      <Menu buttons={[
        {title: "Multiplayer", onClick: multyplayerOnClick},
        {title: "Single play", onClick: () => createPlayers(setPlayers, singleOnClick)}
      ]}/>
    );
  };

export default StartMenuPage;
