import React, { useState } from "react";
import PlayerProps from "../../ts/interfaces/Player.interface"
import FieldPage from "../Field/FieldPage";
import GameState from "../../ts/interfaces/states/GameState.interface";

interface GameProps {
  returnToStartCallBack: () => void;
  players: {
    user: PlayerProps;
    opponent: PlayerProps;
  }
};

const Game: React.FC<GameProps> = ({returnToStartCallBack, 
  players: {user, opponent}}) => {

  const [GameStateHook, setGameState] = useState<GameState>
    ({page: "game", state: opponent.getTurn() ? "turn" : "notTurn"});

  return (
    <FieldPage 
      state={GameStateHook}
      callbacks={{setGameState, leaveGame: returnToStartCallBack}}
      players={{user, opponent}}
      />
    );
  };

export default Game;
