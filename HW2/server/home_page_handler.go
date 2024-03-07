package main

import (
	"io"
	"net/http"
)

func homePage(w http.ResponseWriter, r *http.Request) {
  io.WriteString(w, "home\n")
}
