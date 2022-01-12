import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import { fetchRooms } from "./utils.js"

const app = express()
app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }  
})

app.get('/rooms', async (req, res) => {
  const roomList = await fetchRooms()
  res.status(200)
  res.json(roomList);
})

io.on("connection", (socket) => {
  console.log(`${socket.id} Connected`)

  socket.on("join_room", (room) => {
    socket.join(room)
    console.log(`User with ID: ${socket.id} joined room ${room}`)
  })

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log(`${socket.id} Disconnected`)
  })
})

server.listen(3001, () => console.log('SERVER RUNNING ON PORT 3001'))
