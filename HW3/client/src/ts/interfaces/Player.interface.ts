export default interface PlayerProps {
  name: string;
  char: string;
  isEndCallback: () => void;

  makeMove: (field: string, callback: (at: number) => void) => void;
  update: (field: string) => void;

  isEnd: (field: string) => string;

  getTurn: () => boolean;

  deleteGame: () => void;
}

