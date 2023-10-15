const firebaseConfig = {
  apiKey: "AIzaSyBCtmKx2itxpcnWif6WemyEW_C4ffdYBu8",
  authDomain: "rhiaji-tictactoe.firebaseapp.com",
  databaseURL: "https://rhiaji-tictactoe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rhiaji-tictactoe",
  storageBucket: "rhiaji-tictactoe.appspot.com",
  messagingSenderId: "96053402754",
  appId: "1:96053402754:web:b43397bbeaa0f290a2a89b",
}

const app = firebase.initializeApp(firebaseConfig)
const database = app.database()

function create() {
  const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  const userUid = localStorage.getItem("userUid")

  const db = database.ref("gameid/" + hash)

  const dbmove = database.ref("gameid/" + hash + "/moves")

  const timestamp = Date.now().toString()

  const jsonData = {
    timestamp: timestamp,
    createdby: userUid,
    player1: userUid,
  }

  db.set(jsonData).then(() => {
    localStorage.setItem("gameId", hash)
    localStorage.setItem("player", "Player 1")
    dbmove.set({player: "Player 2"}).then(() => {
      location.href = "game"
    })
  })
}

function getId() {
  firebase
    .auth()
    .signInAnonymously()
    .then((userCredential) => {
      const user = userCredential.user

      localStorage.setItem("userUid", user.uid)

      location.reload()
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message

      console.log(errorCode, errorMessage)
      // ...
    })
}

function getaccount() {
  if (localStorage.getItem("userUid") === undefined) {
  } else {
    const userUid = localStorage.getItem("userUid")
    document.getElementById("userUid").innerHTML = `<h3> Welcome User: ${userUid} </h3>`
  }
}

getaccount()
