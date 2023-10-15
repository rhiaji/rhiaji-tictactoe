const firebaseConfig = {
  apiKey: "AIzaSyBCtmKx2itxpcnWif6WemyEW_C4ffdYBu8",
  authDomain: "rhiaji-tictactoe.firebaseapp.com",
  databaseURL: "https://rhiaji-tictactoe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rhiaji-tictactoe",
  storageBucket: "rhiaji-tictactoe.appspot.com",
  messagingSenderId: "96053402754",
  appId: "1:96053402754:web:b43397bbeaa0f290a2a89b",
}
firebase.initializeApp(firebaseConfig)
const database = firebase.database()
const gameId = localStorage.getItem("gameId")
const userUid = localStorage.getItem("userUid")

document.getElementById("gameId").innerHTML = `<h3>Game Id: ${gameId}</h3>`

let currentPlayer = 1 // Initialize Player 1 as the first

// Define a flag to control cell clickability
let canClick = true

const cellArr = []

const cells = document.querySelectorAll(".cell")

const moveRef = database.ref(`gameid/${gameId}/moves`)
const moveHistory = database.ref(`gameid/${gameId}/moveshistory`)

// Function to enable or disable cell clickability
function setCellClickability(enable) {
  cells.forEach(function (cell, index) {
    if (enable) {
      cell.addEventListener("click", cellClickHandler)
      cell.style.cursor = "pointer"
    } else {
      cell.removeEventListener("click", cellClickHandler)
      cell.style.cursor = "not-allowed"
    }
  })
}

// Click event handler for cells
function cellClickHandler() {
  if (canClick) {
    const cellNumber = Array.from(cells).indexOf(this) + 1
    const player = localStorage.getItem("player")
    moveRef.once("value").then((snapshot) => {
      const data = snapshot.val()
      if (data) {
        const playerMove = data.player

        if (playerMove === "Player 2" && player === "Player 1" && this.children.length === 0) {
          // Update the game state in Firebase for Player 1
          const moveData = {
            player: "Player 1",
            useruid: userUid,
            cellContent: "X", // Player 1's symbol
            cellNumber: cellNumber,
          }

          // Ensure Player 1's move is recorded and the state is updated
          moveRef.once("value").then((snapshot) => {
            const data = snapshot.val()
            moveHistory.push(data)
          })

          moveRef.update(moveData)

          // Disable cell clickability for Player 1
          canClick = false
        } else if (playerMove === "Player 1" && player === "Player 2" && this.children.length === 0) {
          // Update the game state in Firebase for Player 2
          const moveData = {
            player: "Player 2",
            useruid: userUid,
            cellContent: "O", // Player 2's symbol
            cellNumber: cellNumber,
          }

          // Ensure Player 2's move is recorded and the state is updated
          moveRef.once("value").then((snapshot) => {
            const data = snapshot.val()
            moveHistory.push(data)
          })

          moveRef.update(moveData)
          // Disable cell clickability for Player 2
          canClick = false
        } else {
          console.log("It's not your turn or the cell is not empty.")
        }
      } else {
        console.log("No data found in moveRef")
      }
    })
  }
}

// Initialize clickability for Player 1's turn
setCellClickability(true)

// When a player wins, update the style of the winning cells
function highlightWinningCells(combination) {
  combination.forEach((cellNumber) => {
    const cell = document.getElementById(`c${cellNumber}`)
    cell.classList.add("red-cell") // Add a class for the winning color
  })
}

// Check for a winning combination after each move
function checkForWinningCombination(cellArr) {
  const winningCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9], // Horizontal
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9], // Vertical
    [1, 5, 9],
    [3, 5, 7], // Diagonal
  ]

  for (const combination of winningCombinations) {
    const [a, b, c] = combination
    const cellA = cellArr.find((cell) => cell.cellNumber === a)
    const cellB = cellArr.find((cell) => cell.cellNumber === b)
    const cellC = cellArr.find((cell) => cell.cellNumber === c)

    if (cellA && cellB && cellC) {
      if (cellA.cellContent === cellB.cellContent && cellB.cellContent === cellC.cellContent) {
        // We have a winner
        const winnerSymbol = cellC.cellContent
        console.log(`Player [ ${winnerSymbol} ] wins!`)
        highlightWinningCells(combination)

        document.getElementById("winner-display").style.display = "block"
        document
          .getElementById("winner-display-content")
          .insertAdjacentHTML("afterbegin", `<h2><strong> Winner: Player [ ${winnerSymbol} ] </strong></h2>`)

        // You can add code to handle the end of the game here
      }
    }
  }
}

cells.forEach(function (cell, index) {
  cell.addEventListener("click", function () {})
})

moveHistory.on("child_added", async (snapshot) => {
  const moveData = snapshot.val()

  for (const key in moveData) {
    const cell = document.getElementById(`c${moveData.cellNumber}`)

    if (moveData.player === "Player 1") {
      document.getElementById("playerTurn").innerHTML = `<h3>Player 2 Turn</h3>`
    } else if (moveData.player === "Player 2") {
      document.getElementById("playerTurn").innerHTML = `<h3>Player 1 Turn</h3>`
    }

    // Check if the cell is empty before adding a symbol
    if (cell.innerHTML.trim() === "") {
      const span = document.createElement("span")
      span.textContent = moveData.cellContent
      cell.appendChild(span)
      const jsonData = {
        cellContent: moveData.cellContent,
        cellNumber: moveData.cellNumber,
      }
      cellArr.push(jsonData)
    }
  }
  checkForWinningCombination(cellArr)

  // Re-enable cell clickability for the next player
  canClick = true
})

function newgame() {
  moveHistory.remove().then(() => {
    moveRef.set({player: "Player 2"}).then(() => {
      location.reload()
    })
  })
}

function back() {
  location.href = "/"
}

// Get a reference to the chat messages
const gameid = localStorage.getItem("gameId")
const chatRef = firebase.database().ref(`gameid/${gameId}/chatMessages`)
const chatMessages = document.getElementById("chatMessages")

// Listen for new chat messages and display them
chatRef.on("child_added", (snapshot) => {
  const message = snapshot.val()
  const chat = document.createElement("div") // Fix: Create a new element
  chat.classList.add("bubble-chat")
  chat.innerHTML = `<p>${message.username}: ${message.text}</p>`
  chatMessages.appendChild(chat) // Append the chat element to the container
})

/// Function to submit a chat message
function submitChat() {
  const chatInput = document.getElementById("chat")
  const messageText = chatInput.value
  const player = localStorage.getItem("player")

  if (messageText) {
    // Save the chat message to the database
    chatRef.push({
      username: player,
      text: messageText,
    })

    // Clear the chat input field
    chatInput.value = ""
  }
}

// Function to check if Enter key is pressed
function checkEnter(event) {
  if (event.key === "Enter") {
    submitChat()
  }
}

// Attach the event listener to the chat input field
const chatInput = document.getElementById("chat")
chatInput.addEventListener("keyup", checkEnter)
