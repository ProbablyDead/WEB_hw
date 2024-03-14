import React, { useState } from "react";
import PlayerProps from "../../ts/interfaces/Player.interface"
import GameState from "../../ts/interfaces/states/GameState.interface";

import FieldPage from "../Field/FieldPage/FieldPage";
import FieldClassProps from "../../ts/interfaces/Field.interface";
import Field from "../../ts/classes/Field.class";

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
    ({page: "game", state: user.char === "X" ? "turn" : "notTurn"});
  const [CurrentField] = useState<FieldClassProps>(new Field());

  let changeGS = () => setGameState({page: "game", state: GameStateHook.state === "turn" ? "notTurn" : "turn"});

  user.isEndCallback = () => {setGameState({page: "game", state: "end"})};
  opponent.isEndCallback = () => {setGameState({page: "game", state: "end"})};

  return (
    <FieldPage 
      field={CurrentField}
      state={GameStateHook}
      callbacks={
      {
        setTurn: changeGS,
        leaveGame: returnToStartCallBack}
      }
      players={{user, opponent}}
      />
    );
  };

export default Game;
