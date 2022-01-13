import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import { getRooms, updateRooms } from "./utils.js"
import { MongoClient } from "mongodb"

const app = express()
app.use(cors())
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }  
})

app.get('/rooms', async (req, res) => {
  const roomList = await getRooms()
  res.status(200).json(roomList)
})

app.put('/rooms', async (req, res) => {
  await updateRooms(req.body.roomName)
  res.status(204).end()
})


io.on("connection", (socket) => {
  console.log(`${socket.id} Connected`)

  socket.on("join_room", (room) => {
    socket.join(room)
    console.log(`User ${socket.id} joined: ${room}`)
  })

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log(`${socket.id} Disconnected`)
  })
})

server.listen(3001, () => console.log('SERVER RUNNING ON PORT 3001'))
