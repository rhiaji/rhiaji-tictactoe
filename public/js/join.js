function join() {
  const gameid = document.getElementById("gameId").value
  const player2 = localStorage.getItem("userUid")
  const db = database.ref("gameid")

  // Check if the gameid exists
  db.child(gameid)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        // The gameid exists
        const gameData = snapshot.val()

        if (!gameData.player2) {
          // Check if there's no second player yet
          db.child(gameid)
            .update({player2: player2})
            .then(() => {
              localStorage.setItem("gameId", gameid)
              localStorage.setItem("player", "Player 2")
              location.href = "game"
            })
        } else {
          alert("This game already has two players.")
        }
      } else {
        alert("No such game ID exists.")
      }
    })
    .catch((error) => {
      console.error("Error joining the game:", error)
    })
}
