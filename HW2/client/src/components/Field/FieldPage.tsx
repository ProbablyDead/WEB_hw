import React from "react";
import PlayerProps from "../../ts/interfaces/Player.interface";
import GameState from "../../ts/interfaces/states/GameState.interface";
import styles from "./FieldPage.module.css";

interface FieldPorps {
  state: GameState;
  callbacks: { 
    setGameState: (newState: GameState) => void;
    leaveGame: () => void;
  };
  players: {
    user: PlayerProps;
    opponent: PlayerProps;
  };
};

const FieldPage: React.FC<FieldPorps> = ({state, callbacks: {setGameState, leaveGame}, players: {user, opponent}}) => {
  return (
    <div className={styles.field}>
      <div><b>{user.name}</b> vs <b>{opponent.name}</b></div>
      <button onClick={leaveGame}>Leave game</button>
    </div>
  );
};

export default FieldPage;

