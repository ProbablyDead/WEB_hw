export default interface PlayerProps {
  name: string;
  char: string;
  isEndCallback: () => void;

  makeMove: (_field: string, callback: (at: number) => void) => Promise<void>;
  isEnd: (field: string) => void;
  getTurn: () => boolean;
}

