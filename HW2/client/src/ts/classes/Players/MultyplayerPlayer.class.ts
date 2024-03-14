import Player from "./Player.class";
import API from "../API/Api.class";

export default class MultiplayerPlayer extends Player {
  private api: API;
  private isLeft: boolean = false;

  constructor (name: string, api: API) {
    super(name);
    this.api = api;
    this.api.setLeftCallback(() => {
      this.isLeft = true;
      this.isEndCallback();
    });
  }
  
  getTurn(): boolean {
    return this.char === "X";
  }

  deleteGame() {
    this.api.delete_game();
  }

  update(field: string): void {
    this.api.update(field);
  }

  isEnd(field: string): string {
    if (this.isLeft) {
      return "!";
    }
    return super.isEnd(field);
  }

  makeMove(_field: string, callback: (at: number) => void): void {
    this.api.setGetTurnCallback(callback);
    this.api.setEndCallback(this.isEndCallback);
  }
}
