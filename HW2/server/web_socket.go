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

      if game == nil {
        continue
      }

      sendUser(game.host.ws, "joined/" + game.guest.name, 1)

      i := uint8(rand.Intn(2) + 1)
      j := i % 2 + 1 // converts 1 to 2 and vice versa

      game.host.char = i
      game.guest.char = j

      sendUser(game.host.ws, "turn/" + strconv.Itoa(int(i)), messageType)
      sendUser(game.guest.ws, "turn/" + strconv.Itoa(int(j)), messageType)

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
  if conn == nil {
    return 
  }

  if err := conn.WriteMessage(messageType, []byte(message)); err != nil {
    log.Println(err)
    return
  }
}
