import { useState, useEffect } from 'react'
import axios from 'axios'
import './JoinRoom.scss'

export const JoinRoom = ({username, room, joinRoom, setRoom, setUsername}) => {
  const [buttonStatus, setButtonStatus] = useState("")
  const [roomList, setRoomList] = useState(['hello', 'yes'])
  const [roomStatus, setRoomStatus] = useState("Create")
  const [currentRoom, setCurrentRoom] = useState("")

  useEffect(() => {
    if (username !== "" && room !== "") {
      setButtonStatus("join-room__button-active")
    } else {
      setButtonStatus("")
    }

    if (roomList.includes(currentRoom)) {
      return setRoomStatus("Join")
    }
    setRoomStatus("Create")    
  }, [username, room, currentRoom])

  useEffect(() => {
    const fetchRooms = async () => {
      const theRooms = await axios.get('http://localhost:3001/rooms')
      console.log('Rooms:', theRooms.data)
      setRoomList(theRooms.data)
    }
    fetchRooms();
  }, [])

  

  return (
    <div className="join-room">
      <h1 className="join-room__title">Join A Chatroom</h1>
      <input className="join-room__input" type="text" placeholder="Name" onChange={(e) => setUsername(e.target.value)} />
      <input className="join-room__input" type="text" placeholder="Roomname" onChange={(e) => {
        setRoom(e.target.value)
        setCurrentRoom(e.target.value)
      }} />
      <button className={`join-room__button ${buttonStatus} ${roomStatus} ` } onClick={joinRoom}>{`${roomStatus} room`}</button>
    </div>
  )
}
