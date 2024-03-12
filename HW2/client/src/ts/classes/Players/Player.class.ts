import PlayerProps from "../../interfaces/Player.interface";

export default class Player implements PlayerProps {
  name: string;
  char: string;
  isEndCallback: () => void;

  constructor (name: string) {
    this.name = name;
    this.char = " ";
    this.isEndCallback = () => {};
  }

  makeMove (field: string, _callback: (at: number) => void) {
    if (this.isEnd(field) !== "-") {
      this.isEndCallback();
    }
  } 

  isEnd(field: string): string {
    for (let i = 0; i < 3; i++) {
      if (field[3*i] === field[1 + 3*i] && field[1 + 3*i] === field[2 + 3*i] && field[3*i] !== " ") {
        return field[3*i];
      }
      if (field[i] === field[3 + i] && field[3 + i] === field[6 + i] && field[i] !== " "){
        return field[i];
      }
    }

    if (field[0] === field[4] && field[4] === field[8] && field[4] !== " ") {
      return field[0];
    }

    if (field[2] === field[4] && field[4] === field[6] && field[4] !== " ") {
      return field[2];
    }

    if (field.search(" ") === -1) {
      return " ";
    }

    return "-";
  }


  getTurn () { return true; } // stub

};
