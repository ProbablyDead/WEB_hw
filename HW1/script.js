function handleChange(src) {
  let hidenDetails = document.getElementById("myForm")
  let noNeed = document.getElementById("noNeed")

  if (src.value === "positive") {
    hidenDetails.style.display = "block"
  } else if (src.value === "negative") {
    hidenDetails.style.display = "none"
    noNeed.hidden = false
  }
}
