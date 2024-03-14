import React, {useEffect, useState} from "react";
import Menu from "./Menu/Menu";
import styles from "./Menu/Menu.module.css";

import { DNA } from "react-loader-spinner";

import PlayerProps from "../../ts/interfaces/Player.interface";
import MultiplayerPlayer from "../../ts/classes/Players/MultyplayerPlayer.class";
import Player from "../../ts/classes/Players/Player.class";

import Api from "../../ts/classes/API/Api.class";

interface MultiplayerMenuPageProps {
  toGame: () => void;
  backOnClick: () => void;
  setPlayers: (players: {user: PlayerProps, opponent: PlayerProps} | null) => void;
}

function getUserName(): string {
  let input = (document.getElementById('name') as HTMLInputElement);
  if (input.value === "") {
    input.classList.add(styles.error);
  }

  return input.value;
}

function createGame(api: Api, 
  setUserName: (name: string) => void,
  setGameId: (id: string) => void,
  setLoading: () => void,
  setMultyplayerState: () => void) {

    let userName = getUserName();
    if (userName === "") 
      return;

    setUserName(userName);

    api.create_game(userName, (id: string) => {
      setGameId(id);
      setMultyplayerState();
    });

    setLoading();
}

function joinGame(setUserName: (name: string) => void, setMultyplayerState: () => void) {

    let userName = getUserName();
    if (userName === "") 
      return;
  
    setUserName(userName);
    setMultyplayerState();
}

type MultiplayerStates = (
  "menu" | "create" | "join" | "loading" | "noSuchGame"
);


const MultiplayerMenuPage: React.FC<MultiplayerMenuPageProps> = 
  ({toGame, backOnClick, setPlayers}) => {
  
  const [MultiplayerState, setMultyplayerState] = useState<MultiplayerStates>("menu");
  const [GameId, setGameId] = useState<string | null>(null);
  const [api, setApi] = useState<Api | null>(null);
  const [UserName, setUserName] = useState<string>("");

  useEffect(() => {
    setApi(new Api());
  }, [])

  if (api === null) {
    return (
      <div>Error</div>
    );
  }

  const toGameHandler = (userChar: string, opponentName: string) => {
    let user = new Player(UserName), opponent = new MultiplayerPlayer(opponentName, api);

    user.char = userChar === "1" ? "X" : "O";
    opponent.char = user.char === "X" ? "O" : "X";

    setPlayers({user: user, opponent: opponent});
    toGame();
  };

  const BackButton = <Menu buttons={
    [{title: "Back", onClick: () => { api.delete_game(); setMultyplayerState("menu");} }]
  }/>;

  api.setToGameCallback(toGameHandler);
  api.setFailureCallback(() => {setMultyplayerState("noSuchGame")});

  switch (MultiplayerState) {
    case "menu":
      return (
        <div>
          <Menu buttons={[
            {title: "Create game", 
              onClick: () => {
                createGame(api, setUserName, setGameId,
                () => setMultyplayerState("loading"),() => setMultyplayerState("create"));
              }},
            {title: "Join game", 
              onClick: () => joinGame(setUserName, () => setMultyplayerState("join"))},
            {title: "Back", 
              onClick: () => { setPlayers(null); backOnClick(); }}
            ]}
          />
          <label htmlFor="name">
            Input your name:
          </label>
          <input autoComplete="off" type='text' id='name' name='name' required minLength={1} maxLength={20} size={25} defaultValue={UserName}/>
        </div>
        );
    case "create":
      return (
        <div className={styles.info}>
          <div>Waiting for an opponent</div>
          <DNA/>
          <div>Room code:</div>
          <div>
            {GameId === "failure" ? "The maximum number of games has been reached, please try again later" : GameId}
          </div>
          <div><i>Your friend should write this code on "Join" page</i></div>
          <div>
            {BackButton}
          </div>
        </div>
      );
    case "noSuchGame":
    case "join":
      return (
        <div className={styles.info}>
          <div>
            <label htmlFor="inviteCode">Write invite code (two digits):</label>
          </div>
          <div>
            <input autoComplete="off" type='text' inputMode="numeric" id='inviteCode' name='inviteCode' required minLength={2} maxLength={2} size={5}/>
            <Menu buttons={[{title: "Join", onClick: () => {
              let input = (document.getElementById('inviteCode') as HTMLInputElement);
              if (input.value.length < 2 ) {
                input.classList.add(styles.error);
                return;
              }
              api.join_game(input.value, UserName);
            }}]}/>
          </div>
          { MultiplayerState === "noSuchGame" ? <div><b>No such game!</b></div> : <div></div>}
          <div>
            {BackButton}
          </div>
        </div>
      );
    case "loading":
      return (
        <div>
          <DNA/>
          <div>
            {BackButton}
          </div>
        </div>
      );
  };
};

export default MultiplayerMenuPage;
