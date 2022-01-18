import { useState, useEffect, useRef} from "react"
import axios from 'axios'
import './Chat.scss'

const API = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001/'

export const Chat = ({socket, username, room, setShowJoinRoom}) => {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])
  const [typing, setTyping] = useState(false)
  const messageEndRef = useRef(null);


  const sendMessage = async () => {
    if (currentMessage === "") return;
    const currentTime = new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute: '2-digit'})

    const messageData = {
      username,
      room,
      message: currentMessage,
      time: currentTime
    }
    setCurrentMessage("")
    await socket.emit("send_message", messageData)
    setMessageList((prevList) => [...prevList, messageData ])
  }

  const messageInput = (e) => {
    setCurrentMessage(e.target.value)
    socket.emit("typing", room)
  }

  useEffect(() => {
    let timerID;
    socket.on("receive_message", (data) => {
      setTyping(false)
      setMessageList((prevList) => [...prevList, data])
    })

    socket.on("typing", (data) => {
      setTyping(true)
      clearTimeout(timerID)
      timerID = setTimeout(() => {
        setTyping(false)
      }, 3000);
    })

    
  }, [socket])

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await axios.get(`${API}getMessages`, { params: {roomName: room} })
      setMessageList(messages.data)
    }
    fetchMessages();
  }, [room])

  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messageList, typing])

  return (
    <div className="chat">
      <div className="chat__header">
        <button className="chat__header__back-button" onClick={() => setShowJoinRoom(true)}>&lt;</button>
        <h1 className="chat__header__title">{room}</h1>
      </div>

      <div className="chat__body">
        {messageList.map((message, index) => {
          const messageClass = (message.username === username) ? "--you" : ""
          const metaClass = (message.username === username) ? "meta-you" : "" 
          const name = (message.username === username) ? "You" : message.username
          return (
            <div key={index} className="chat__body__message">
              <div className={`chat__body__message__meta ${metaClass}`}>
                <p className={`chat__body__message__time time${messageClass}`}>{message.time}</p>
                <p className={`chat__body__message__name time${messageClass}`}>{name}:</p>
              </div>
              <p className={`chat__body__message__text text${messageClass}`}>{message.message}</p>
            </div>
          )
        })}
        {typing && <div className="chat__body__message">
          <div className="chat__body__message__text"id="wave">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>}
        <div ref={messageEndRef}/>
      </div>

      <div className="chat__footer">
        <input 
          value={currentMessage}
          className="chat__footer__input"
          type="text" 
          placeholder="message..." 
          onChange={e => messageInput(e)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className="chat__footer__button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}
