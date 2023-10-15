const express = require("express")
const app = express()
app.use(express.json())

// Import and use the router for your existing routes (e.g., userRoutes)
const userRoutes = require("./routes/userRoutes")

// Configure Express to serve static files from the "public" directory
app.use(express.static(__dirname + "/public"))

app.use("/", userRoutes)

// Start the server
const port = process.env.PORT || 5001

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

// Signal that the server is ready
server.on("listening", () => {
  console.log("Server is fully initialized and running.")
})
