import './App.scss';
import io from 'socket.io-client'
import { useState, useEffect } from 'react';
import { Chat } from './components/Chat';
import { JoinRoom } from './components/JoinRoom';

const URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001/'

const socket = io.connect(URL)

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showJoinRoom, setShowJoinRoom] = useState(true)

  useEffect(() => {
    if (showJoinRoom === true) socket.emit("join_lobby")
  }, [showJoinRoom])

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
