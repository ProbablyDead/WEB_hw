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

  async makeMove (_field: string, _callback: (at: number) => void) { } // stub

  isEnd (_field: string) { } // stub

  getTurn () { return true; } // stub

};
