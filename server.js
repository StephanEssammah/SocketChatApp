import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import { getRooms, getMessages, createRoom, newMessage } from "./utils.js"
import path from "path"

const app = express()
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server)

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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

server.listen(3001, () => console.log('SERVER RUNNING ON PORT 3001'))
