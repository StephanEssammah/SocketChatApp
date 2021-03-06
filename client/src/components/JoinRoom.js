import { useState, useEffect } from 'react'
import axios from 'axios'
import './JoinRoom.scss'

const API = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001/'

export const JoinRoom = ({socket, username, room, setShowJoinRoom, setRoom, setUsername}) => {
  const [buttonStatus, setButtonStatus] = useState("")
  const [roomList, setRoomList] = useState([])
  const [roomStatus, setRoomStatus] = useState("Create")
  const [currentRoom, setCurrentRoom] = useState("")

  useEffect(() => {
    username === "" || room === ""
      ? setButtonStatus("button-inactive")
      : setButtonStatus("")
    
    roomList.includes(currentRoom)
      ? setRoomStatus("Join")
      : setRoomStatus("Create")  
  }, [username, room, currentRoom, roomList])

  useEffect(() => {
    const fetchRooms = async () => {
      const theRooms = await axios.get(`${API}getRooms`)
      setRoomList(theRooms.data)
    }
    fetchRooms();
  }, [setShowJoinRoom])

  useEffect(() => {
    socket.on("room_created", (room) => {
      setRoomList((prevList) => [...prevList, room])
    })
  }, [socket])

  const joinRoom = async () => {
    if (username === ""|| room === "") return;
    if (roomStatus === "Create") {
      await axios.post(`${API}createRoom`, { roomName: currentRoom})
      socket.emit("create_room", {room, username})
    }
    socket.emit("join_room", {room, username})
    setShowJoinRoom(false)
  }


  return (
    <div className="join-room">
      <h1 className="join-room__title">Join a chatroom</h1>
      <input 
        className="join-room__input" 
        type="text" 
        placeholder="Name..."
        onKeyPress={(e) => e.key === "Enter" && joinRoom()}  
        onChange={(e) => setUsername(e.target.value)} />
      <input 
        className="join-room__input" 
        type="text" 
        placeholder="Room name..."
        onKeyPress={(e) => e.key === "Enter" && joinRoom()} 
        onChange={(e) => {
          setRoom(e.target.value)
          setCurrentRoom(e.target.value)
      }} />
      <button className={`join-room__button ${buttonStatus} ${roomStatus} ` } onClick={joinRoom}>{`${roomStatus} room`}</button>
    </div>
  )
}
