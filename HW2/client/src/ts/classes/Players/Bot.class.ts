import Player from "./Player.class";

export default class Bot extends Player {
  makeMove(field: string, callback: (at: number) => void) {
    if (this.isEnd(field) !== "-") {
      this.isEndCallback();
    } else {
      if (field.search(" ") !== -1) {
        callback(field.search(" "));
      }
    }
  }

  getTurn(): boolean {
    return Math.random() < 0.5;
  }
}
