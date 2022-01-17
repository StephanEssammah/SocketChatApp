import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import { getRooms, getMessages, createRoom, newMessage } from "./utils.js"
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

app.get('/getRooms', async (req, res) => {
  const roomList = await getRooms()
  res.status(200).json(roomList)
})

app.get('/getMessages', async (req, res) => {
  const messages = await getMessages(req.query.roomName)
  res.status(200).json(messages)
})

app.post('/createRoom', async (req, res) => {
  await createRoom(req.body.roomName)
  res.status(201).end()
})



io.on("connection", (socket) => {
  socket.on("join_lobby", () => {
    socket.join('lobby')
  })

  socket.on("join_room", ({username, room}) => {
    socket.join(room)
    console.log(`${username} joined room: ${room}`)
  })

  socket.on("create_room", ({username, room}) => {
    socket.to('lobby').emit("room_created", room)
    console.log(`${username} created room: ${room}`)
  })

  socket.on("typing", (room) => {
    socket.to(room).emit("typing", room)
  })

  socket.on("send_message", async (data) => {
    await newMessage(data)
    socket.to(data.room).emit("receive_message", data)
  })
})

server.listen(3001, () => console.log('SERVER RUNNING ON PORT 3001'))
