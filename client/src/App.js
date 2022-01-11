import './App.css';
import io from 'socket.io-client'
import { useState } from 'react';
import { Chat } from './components/Chat';

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
      {showJoinRoom ? (
        <>
          <h3>Join A Chatroom</h3>
          <input type="text" placeholder="Name" onChange={(e) => setUsername(e.target.value)} />
          <input type="text" placeholder="Roomname" onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join chatroom</button>
        </>
      )
      :
      (
        <Chat socket={socket} username={username} room={room}/>
      )}
    </div>
  );
}

export default App;
