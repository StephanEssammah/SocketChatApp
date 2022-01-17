import './App.scss';
import io from 'socket.io-client'
import { useState } from 'react';
import { Chat } from './components/Chat';
import { JoinRoom } from './components/JoinRoom';

const socket = io.connect("http://localhost:3001")

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showJoinRoom, setShowJoinRoom] = useState(true)

  return (
    <div className="App">
      {showJoinRoom 
      ? <JoinRoom socket={socket} username={username} room={room} setUsername={setUsername} setRoom={setRoom} setShowJoinRoom={setShowJoinRoom}/>
      : <Chat socket={socket} username={username} room={room} setShowJoinRoom={setShowJoinRoom}/>
      }
    </div>
  );
}

export default App;
