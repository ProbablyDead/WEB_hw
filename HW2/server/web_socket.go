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

  log.Println("Client connected")

  reader(ws)
}

func delete(conn *websocket.Conn) {
  game := findGame(conn)
 
  if game == nil {
    return
  }
 
  if game.host.ws != nil {
    sendUser(game.host.ws, "deleted", 1)
  }
  if game.guest.ws != nil {
    sendUser(game.guest.ws, "deleted", 1)
  }
 
  deleteGame(conn)
}

func reader(conn *websocket.Conn) {
  for {
    messageType, p, err := conn.ReadMessage()
    if err != nil {
      delete(conn)
      log.Println(err)
      return
    }

    commands := strings.Split(string(p), "/")

    fmt.Println(commands)

    switch commands[0] {
    case "create":
      sendUser(conn, "created/" + createGame(Player{ws: conn, name: commands[1]}), messageType)
    case "delete":
      delete(conn)
    case "join":
      n, err := strconv.Atoi(commands[1])
      if err != nil {
        log.Println(err)
      }

      hostChar := uint8(rand.Intn(2) + 1)
      guestChar := hostChar % 2 + 1 // converts 1 to 2 and vice versa

      game := findById(n)

      if game == nil {
        sendUser(conn, "failure", messageType)
        continue
      }

      sendUser(conn, joinGame(Player{ws: conn, name: commands[2]}, n) + "/" + strconv.Itoa(int(guestChar)), messageType)

      game.host.char = hostChar
      game.guest.char = guestChar

      sendUser(game.host.ws, "joined/" + game.guest.name + "/" + strconv.Itoa(int(hostChar)), 1)

    case "update":
      n, err := strconv.Atoi(commands[1])
      if err != nil {
        log.Println(err)
      }
      updateField(n, commands[2])

      game := findById(n)
      end, v := check_end_game(*game)

      if end {
        if game.host.char == v {
          sendUser(game.host.ws, "win", messageType)
          sendUser(game.guest.ws, "lose", messageType)
        } else if game.guest.char == v {
          sendUser(game.guest.ws, "win", messageType)
          sendUser(game.host.ws, "lose", messageType)
        } else {
          sendUser(game.guest.ws, "draw", messageType)
          sendUser(game.host.ws, "draw", messageType)
        }
        deleteGame(game.host.ws)
        continue
      }

      field := getField(game.id)
      if game.guest.ws == conn {
        sendUser(game.host.ws, "turn/" + field, messageType)
      } else {
        sendUser(game.guest.ws, "turn/" + field, messageType)
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
