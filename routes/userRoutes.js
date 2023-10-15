const express = require("express")
const router = express.Router()

const path = require("path")

router.get("/game", (req, res) => {
  const filePath = path.join(__dirname, "../public/views/game.html")
  res.sendFile(filePath)
})

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../public/views/home.html")
  res.sendFile(filePath)
})

module.exports = router
