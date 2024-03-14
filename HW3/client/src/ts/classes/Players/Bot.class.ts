import Player from "./Player.class";

export default class Bot extends Player {
  apply_delay: boolean = false;
  private delay_num = 500;

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private setCharAt(str: string, at: number, char: string): string {
    return str.substring(0, at) + char + str.substring(at + 1);
  }

  makeMove(field: string, callback: (at: number) => void) {
    if (this.isEnd(field) !== "-") {
      this.isEndCallback();
      return;
    }

    if (this.apply_delay) {
      (async () => {
        await this.delay(this.delay_num);
        callback(this.getBestMove(field));
      })();
    } else {
      callback(this.getBestMove(field));
    }
  }

  private getBestMove(field: string): number {
    let bestScore = -Infinity;
    let moves: number[] = [];

    for (let i = 0; i < 9; i++) {
      if (field[i] === " ") {
        let score = this.minimax(this.setCharAt(field, i, this.char));
        if (score > bestScore) {
          moves = [i];
          bestScore = score;
        } else if (bestScore == score) {
          moves.push(i);
        }
      }
    }

    return moves[Math.floor(Math.random()*moves.length)];
  }

  private minimax(field: string, isMaximising: boolean = false): number {
    let result = this.isEnd(field);
    if (result !== "-") {
      if (result === this.char) {
        return 1;
      } else if (result === " ") {
        return 0;
      } else {
        return -1;
      }
    }

    let bestScore = (isMaximising ? -1 : 1)*Infinity;
    let opChar = this.char === "X" ? "O" : "X";

    for (let i = 0; i < 9; i++) {
      if (field[i] === " ") {
        let score = this.minimax(this.setCharAt(field, i, isMaximising ? this.char : opChar), !isMaximising);
        bestScore = isMaximising ? Math.max(bestScore, score) : Math.min(bestScore, score);
      }
    }

    return bestScore;
  }

  getTurn(): boolean {
    return Math.random() < 0.5;
  }
}
