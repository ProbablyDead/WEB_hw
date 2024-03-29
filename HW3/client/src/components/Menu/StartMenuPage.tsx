import React from "react";
import Menu from "./Menu/Menu";

import PlayerProps from "../../ts/interfaces/Player.interface";
import Player from "../../ts/classes/Players/Player.class";
import Bot from "../../ts/classes/Players/Bot.class";

interface StartMenuPageProps {
  multyplayerOnClick: () => void;
  singleOnClick: () => void;
  setPlayers: (players: {user: PlayerProps, opponent: PlayerProps} | null) => void;
}

function createPlayerAndBot(setPlayers: (players: {user: PlayerProps, opponent: PlayerProps} | null) => void, singleOnClick: () => void) {
  let user = new Player("You"), opponent = new Bot("Bot");

  if (opponent.getTurn()) {
    user.char = "X";
    opponent.char = "O";
  } else {
    user.char = "O";
    opponent.char = "X";
  }

  setPlayers({user: user, opponent: opponent});
  singleOnClick();
}

function createBots(setPlayers: (players: {user: PlayerProps, opponent: PlayerProps} | null) => void, singleOnClick: () => void) {
  let user = new Bot("Bot_1"), opponent = new Bot("Bot_2");

  user.apply_delay = true;
  opponent.apply_delay = true;

  if (opponent.getTurn()) {
    user.char = "X";
    opponent.char = "O";
  } else {
    user.char = "O";
    opponent.char = "X";
  }

  setPlayers({user: user, opponent: opponent});
  singleOnClick();
}

const StartMenuPage: React.FC<StartMenuPageProps> = 
  ({multyplayerOnClick, singleOnClick, setPlayers}) => {
  return (
      <Menu buttons={[
        {title: "Multiplayer", onClick: multyplayerOnClick},
        {title: "Single play", onClick: () => createPlayerAndBot(setPlayers, singleOnClick)},
        {title: "Bot vs Bot OMG", onClick: () => createBots(setPlayers, singleOnClick)}
      ]}/>
    );
  };

export default StartMenuPage;
