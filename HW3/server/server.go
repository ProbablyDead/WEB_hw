package main

import (
	"errors"
	"fmt"
	"net/http"
)

func main() {
  initGames()

  mux := http.NewServeMux()

  mux.HandleFunc("/", homePage)

  mux.HandleFunc("/ws", upgradeToWSHandler)

  err := http.ListenAndServe(":8080", mux)

  if errors.Is(err, http.ErrServerClosed) {
    fmt.Println("Server closed")
  } else if err != nil {
    fmt.Printf("error starting: %s\n", err)
  }
}
