import Player from "./Player.class";

export default class Bot extends Player {
  async makeMove(field: string, callback: (at: number) => void) {
    console.log("bot moved");
    callback(field.search(" "));
  }

  isEnd(field: string) {
    for (let i = 0; i < 3; i++) {
      if (field[3*i] === field[1 + 3*i] && field[1 + 3*i] === field[2 + 3*i] && field[3*i] !== " ") {
        this.isEndCallback();
      }
      if (field[i] === field[3 + i] && field[3 + i] === field[6 + i] && field[i] !== " "){
        this.isEndCallback();
      }
    }

    if (field[0] === field[4] && field[4] === field[8] && field[4] !== " ") {
      this.isEndCallback();
    }

    if (field[2] === field[4] && field[4] === field[6] && field[4] !== " ") {
      this.isEndCallback();
    }
  }

  getTurn(): boolean {
    return Math.random() < 0.5;
  }
}
