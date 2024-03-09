import PlayerProps from '../interfaces/Player.interface'

export default class Player implements PlayerProps {
  ws?: WebSocket;
  name: string;

  constructor (name: string) {
    this.name = name;
    // this.ws = ws;
  };
}
