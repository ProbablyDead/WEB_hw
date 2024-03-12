import React, {useCallback, useEffect} from "react";
import PlayerProps from "../../../ts/interfaces/Player.interface";
import GameState from "../../../ts/interfaces/states/GameState.interface";
import FieldClassProps from "../../../ts/interfaces/Field.interface";
import FieldCell from "../FieldCell/FieldCell";
import styles from "./FieldPage.module.css";
import MenuButton from "../../Menu/Menu/MenuButton/MenuButton";


interface FieldPorps {
  field: FieldClassProps;
  state: GameState;
  callbacks: { 
    setTurn: () => void;
    leaveGame: () => void;
  };
  players: {
    user: PlayerProps;
    opponent: PlayerProps;
  };
};

const FieldPage: React.FC<FieldPorps> = ({field, state, callbacks: {setTurn, leaveGame}, players: {user, opponent}}) => {
  let turnBool = state.state === "turn"; 
  let player = turnBool ? user : opponent;

  let cells = [];
  let fieldS = field.getField();

  let handler = useCallback((at: number) => {
    field.setField(fieldS.substring(0, at) + player.char + fieldS.substring(at + 1));
    setTurn();
  }, [field, fieldS, player.char, setTurn]);

  useEffect(() => {
    if (state.state !== "end") {
      player.makeMove(fieldS, handler);
    }
  }, [state, handler, player, fieldS]);

  for (let i = 0; i < fieldS.length/3; i++) {
    let row = [];

    for (let j = 0; j < fieldS.length/3; j++) {
      let k = i*3 + j;
      let condition = !turnBool || fieldS[k] !== " "; 

      row.push (
        <FieldCell
          key={k}
          char={fieldS[k]}
          onClick={() => handler(k)}
          disabled={condition}
        />
      );
    }

    cells.push(
      <div key={i} className={styles.row}>
        {row}
      </div>
    );
  }

  let currentTurnString;

  if (player.name.toLowerCase() !== "you") {
    currentTurnString = player.name + "'s";
  } else {
    currentTurnString = "Your";
  }

  currentTurnString += " turn";

  if (state.state === "end") {
    currentTurnString = "";

    let endS = opponent.isEnd(fieldS);
    console.log(endS);

    if (endS === " ") {
        currentTurnString = "Tie";
    } else {
      currentTurnString = (endS === user.char ? user.name : opponent.name) + " wins!";
    }
  }

  return (
  <div>
    <div className={styles.players}><b>{user.name}</b> vs <b>{opponent.name}</b></div>
    <div className={styles.field}>
      {cells} 
      <div>
        {currentTurnString}
      </div>
    </div>
    <MenuButton title="Leave game" onClick={leaveGame}/>
  </div>
  );
};

export default FieldPage;

