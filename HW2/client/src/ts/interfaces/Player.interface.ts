export default interface PlayerProps {
  name: string;
  char: string;
  isEndCallback: () => void;

  makeMove: (_field: string, callback: (at: number) => void) => void;
  isEnd: (field: string) => string;
  getTurn: () => boolean;
}

