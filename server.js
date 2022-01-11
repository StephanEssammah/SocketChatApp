import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"

const app = express()
app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }  
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