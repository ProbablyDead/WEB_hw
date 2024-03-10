import React from "react";
import Menu from "./Menu/Menu";
import styles from "./Menu/Menu.module.css";

import PlayerProps from "../../ts/interfaces/Player.interface";
import MultiplayerPlayer from "../../ts/classes/MultyplayerPlayer.class";

interface MultiplayerMenuPageProps {
  toGame: () => void;
  backOnClick: () => void;
  setPlayers: (players: {user: PlayerProps, opponent: PlayerProps} | null) => void;
}

function createPlayers(setPlayers: (players: {user: PlayerProps, opponent: PlayerProps} | null) => void, finish: () => void) {
  let input = (document.getElementById('name') as HTMLInputElement);
  let playerName = input.value;

  if (playerName === "") {
    input.classList.add(styles.error);
    return;
  }
  
  setPlayers({user: new MultiplayerPlayer(playerName), opponent: new MultiplayerPlayer("bot")});

  finish();
}

const MultiplayerMenuPage: React.FC<MultiplayerMenuPageProps> = 
  ({toGame, backOnClick, setPlayers}) => {
  return (
    <div>
      <Menu buttons={[
        {title: "Create game", onClick: () => createPlayers(setPlayers, toGame)},
        {title: "Join game", onClick: () => createPlayers(setPlayers, toGame)},
        {title: "Back", onClick: backOnClick}
        ]}
      />
      <label>
        Input your name:
      </label>
      <input type='text' id='name' name='name' required minLength={1} maxLength={20} size={25}/>
    </div>
    );
  };

export default MultiplayerMenuPage;
