package main

import (
	"math/rand"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
  ReadBufferSize: 1024,
  WriteBufferSize: 1024,
}

func upgradeToWSHandler(w http.ResponseWriter, r *http.Request) {
  upgrader.CheckOrigin = func(r *http.Request) bool { return true }

  ws, err := upgrader.Upgrade(w, r, nil)
  if err != nil {
    log.Println(err)
  }

  err = ws.WriteMessage(1, []byte("Hello there"))
  if err != nil {
    log.Println(err)
  }

  log.Println("Client connected")

  reader(ws)
}

func reader(conn *websocket.Conn) {
  for {
    messageType, p, err := conn.ReadMessage()
    if err != nil {
      deleteGame(conn)
      log.Println(err)
      return
    }

    commands := strings.Split(string(p), "/")

    fmt.Println(commands)

    switch commands[0] {
    case "create":
      sendUser(conn, createGame(Player{ws: conn, name: commands[1]}), messageType)
    case "join":
      n, err := strconv.Atoi(commands[1])
      if err != nil {
        log.Println(err)
      }
      sendUser(conn, joinGame(Player{ws: conn, name: commands[2]}, n), messageType)

      game := findGame(conn)
      sendUser(game.host.ws, "joined/" + game.guest.name, 1)

      i := rand.Intn(2) 

      if i == 0 {
        game.host.char = 1
        game.guest.char = 2
        sendUser(game.host.ws, "turn/1", messageType)
      } else {
        game.guest.char = 1
        game.host.char = 2
        sendUser(game.guest.ws, "turn/1", messageType)
      }
    case "update":
      n, err := strconv.Atoi(commands[1])
      if err != nil {
        log.Println(err)
      }
      updateField(n, commands[2])

      game := findGame(conn)
      end, v := check_end_game(*game)

      if end {
        if game.host.char == v {
          sendUser(game.host.ws, "win", messageType)
          sendUser(game.guest.ws, "lose", messageType)
        } else {
          sendUser(game.guest.ws, "win", messageType)
          sendUser(game.host.ws, "lose", messageType)
        }
        deleteGame(game.host.ws)
      }

      field := getField(game.id)
      if game.guest.ws == conn {
        sendUser(game.host.ws, field, messageType)
        sendUser(game.host.ws, "turn", messageType)
      } else {
        sendUser(game.guest.ws, field, messageType)
        sendUser(game.guest.ws, "turn", messageType)
      }

    }
  }
}

func sendUser(conn *websocket.Conn, message string, messageType int) {
  if conn != nil {
    if err := conn.WriteMessage(messageType, []byte(message)); err != nil {
      log.Println(err)
      return
    }
  }
}
