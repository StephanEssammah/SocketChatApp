import './App.css';
import io from 'socket.io-client'
import { useState } from 'react';
import { Chat } from './components/Chat';
import { JoinRoom } from './components/JoinRoom';

const socket = io.connect("http://localhost:3001")

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showJoinRoom, setShowJoinRoom] = useState(true)

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room)
      setShowJoinRoom(false)
    }
  }

  return (
    <div className="App">
      {showJoinRoom 
      ? <JoinRoom username={username} room={room} setUsername={setUsername} setRoom={setRoom} joinRoom={joinRoom}/>
      : <Chat socket={socket} username={username} room={room}/>
      }
    </div>
  );
}

export default App;
