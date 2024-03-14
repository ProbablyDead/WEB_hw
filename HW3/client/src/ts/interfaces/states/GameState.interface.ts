export default interface GameState {
  page: "game";
  state: "turn" | "notTurn" | "end";
}
