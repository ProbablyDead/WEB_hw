package main

import "github.com/gorilla/websocket"

type Player struct {
  ws *websocket.Conn
  name string
  char uint8
}
