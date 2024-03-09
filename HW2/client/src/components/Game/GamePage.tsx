import React from "react"
import PlayerProps from "../../ts/interfaces/Player.interface"

interface GamePageProps {
  Player1: PlayerProps;
  Player2: PlayerProps;
}

const GamePage: React.FC<GamePageProps> = 
  ({Player1, Player2}) => {
    return (
      <div>
        {Player1.name} vs {Player2.name}
      </div>
    );
  };

export default GamePage;
