package main

import (
	"fmt"
	"math/rand"
	"slices"
	"strconv"

	"github.com/gorilla/websocket"
)

const success = "success"
const failure = "failure"
const max_games = 10

type Game struct {
  id int
  free bool

  host Player 
  guest Player

  field []uint8
}

var games = make([]Game, max_games)

func initGames() {
  for i := range games {
    games[i].free = true
  }
}

func createGame(player Player) string {
  game_id := slices.IndexFunc(games, func(g Game) bool { return g.free })

  if game_id == -1 {
    return failure
  }

  game := &games[game_id]

  var r int
  for {
    r = rand.Intn(90) + 10
    check_id := slices.IndexFunc(games, func(g Game) bool { return g.id == r })

    if check_id == -1 {
      break
    }
  }

  game.id = r
  game.free = false
  game.host = player
  game.field = make([]uint8, 9)

  printGames()
  return strconv.Itoa(game.id)
}

func joinGame(player Player, id int) string {
  game_id := slices.IndexFunc(games, func(g Game) bool { return g.id == id && g.guest.ws == nil })

  if game_id == -1 {
    return failure
  }

  games[game_id].guest = player

  printGames()
  return success + "/" + games[game_id].host.name
}

func updateField(id int, newField string) {
  game_id := slices.IndexFunc(games, func(g Game) bool { return g.id == id })

  if game_id == -1 {
    return 
  }

  for i, v := range newField {
    games[game_id].field[i] = uint8(v - '0') 
  }

  printGames()
  return 
}

func findGame(user *websocket.Conn) *Game {
  game_id := slices.IndexFunc(games, func(g Game) bool { return g.host.ws == user || g.guest.ws == user })

  if game_id == -1 {
    return nil
  }

  return &games[game_id]
}

func deleteGame(user *websocket.Conn) {
  game_id := slices.IndexFunc(games, func(g Game) bool { return g.host.ws == user || g.guest.ws == user })

  if game_id == -1 {
    return 
  }

  game := &games[game_id]

  if game.host.ws != nil {
    game.host.ws.Close()
    game.host.ws = nil
  }

  if game.guest.ws != nil {
    game.guest.ws.Close()
    game.guest.ws = nil
  }

  game.free = true

  printGames()
}

func check_end_game(game Game) (bool, uint8) {
  g_field := game.field

  flag := false
  for _, v := range g_field {
    if v != 0 {
      flag = true
    }
  }

  if !flag {
    return true, 3
  }
  
  for i := 0; i < 3; i++ {
    if g_field[3*i] == g_field[1 + 3*i] && g_field[1 + 3*i] == g_field[2 + 3*i] && g_field[3*i] != 0 {
      return true, g_field[3*i]
    }
    if g_field[i] == g_field[3 + i] && g_field[3 + i] == g_field[6 + i] && g_field[i] != 0 {
      return true, g_field[i]
    }
  }

  if g_field[0] == g_field[4] && g_field[4] == g_field[8] && g_field[4] != 0 {
    return true, g_field[4]
  }
  if g_field[2] == g_field[4] && g_field[4] == g_field[6] && g_field[4] != 0 {
    return true, g_field[4]
  }

  return false, 0
}

func printGames() {
  strField := func(arr []uint8) string {
    res := ""

    for i, v := range arr {
      if i%3 == 0 {
        res += "\n\t"
      }

      s := ""

      switch v {
      case 0:
        s = "*"
      case 1:
        s = "X"
      case 2:
        s = "O"
      }

      res += s
    }

    return res
  }

  for i, v := range games {
    fmt.Printf("%d\tFree: %t\tId: %d\tHost: %s\t\tGuest: %s\nFiled:%s\n", 
      i, v.free, v.id, v.host.name, v.guest.name, strField(v.field))
  }
}

func getField(id int) string {
  game_id := slices.IndexFunc(games, func(g Game) bool { return g.id == id })

  if game_id == -1 {
    return "" 
  }

  res := ""

  for _, v := range games[game_id].field {
    res += strconv.Itoa(int(v))
  }

  return res
}
