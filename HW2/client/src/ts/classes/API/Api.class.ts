export default class Api {
  private ws: WebSocket;

  private createCallback: (id: string) => void = () => {};
  private toGameCallback: (userChar: string, opponentName: string) => void = () => {};
  private getTurnCallback: (pos: number) => void = () => {};
  private endCallback: () => void = () => {};
  private failureCallback: () => void = () => {};
  private leftCallback: () => void = () => {};

  private id: string = "0";
  private lastField: string = "0".repeat(9);

  constructor () {
    this.ws = new WebSocket("ws://localhost:8080/ws");

    let createdHandler = (id: string) => {
      this.id = id;
      this.createCallback(id);
    };

    let joinedHandler = (userChar: string, opponentName: string) => {
      this.toGameCallback(userChar, opponentName);
    };

    let turnHandler = (newF: string) => {
      for (let i = 0; i < newF.length; i++) {
        if (newF[i] !== this.lastField[i]) 
          this.getTurnCallback(i);
      }
    };

    let endCallbackHandler = () => {
      this.endCallback();
    };

    let failureCallbackHandler = () => {
      this.failureCallback();
    };

    let leftCallbackHandler = () => {
      this.leftCallback();
    };

    this.ws.onmessage = function (msgevent) {
      let message = (msgevent.data as string).split("/");

      switch (message[0]) {
        case "created":
          createdHandler(message[1]);
          break;
        case "joined":
          joinedHandler(message[2], message[1]);
          break;
        case "deleted":
          leftCallbackHandler();
          break;
        case "turn":
          turnHandler(message[1]);
          break;
        case "failure":
          failureCallbackHandler();
          break;
        default:
          endCallbackHandler();
          break;
      }
    };

  }

  update (field: string) {
    let s = "";
    for (let c of field) {
      let a;
      switch (c) {
        case " ":
          a = "0"
          break;
        case "X":
          a = "1"
          break;
        case "O":
          a = "2"
          break;
      }
      s += a;
    }
    this.lastField = s;
    this.ws.send("update/" + this.id + "/" + s);
  }

  setGetTurnCallback (callback: (pos: number) => void) {
    this.getTurnCallback = callback;
  }

  setToGameCallback (callback: (userChar: string, opponentName: string) => void) {
    this.toGameCallback = callback;
  }

  setEndCallback (callback: () => void) {
    this.endCallback = callback;
  }

  setFailureCallback (callback: () => void) {
    this.failureCallback = callback;
  }

  setLeftCallback (callback: () => void) {
    this.leftCallback = callback;
  }

  delete_game () {
    this.ws.send("delete");
  }

  create_game (playerName: string, callback: (id: string) => void) {
    this.ws.send("create/" + playerName);
    this.createCallback = callback;
  }

  join_game (id: string, playerName: string) {
    this.id = id;
    this.ws.send("join/" + id + "/" + playerName);
  }
}

