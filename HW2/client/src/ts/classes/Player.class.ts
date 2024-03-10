import PlayerProps from "../interfaces/Player.interface"

export default class Player implements PlayerProps {
  name: string;
  char: number;

  constructor (name: string) {
    this.name = name;
    this.char = 2;
  }

  getTurn () { 
    return true;
  }
};
