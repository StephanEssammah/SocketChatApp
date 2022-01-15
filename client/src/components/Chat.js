import { useState, useEffect, useRef} from "react"
import axios from 'axios'
import './Chat.scss'

export const Chat = ({socket, username, room}) => {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])
  const messageEndRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage === "") return;
    const messageData = {
      username,
      room,
      message: currentMessage,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
    }
    setCurrentMessage("")
    await socket.emit("send_message", messageData)
    setMessageList((prevList) => [...prevList, messageData ])
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((prevList) => [...prevList, data])
    })
  }, [socket])

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await axios.get('http://localhost:3001/getMessages', { params: {roomName: room} })
      setMessageList(messages.data)
    }
    fetchMessages();
  }, [room])

  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messageList])

  return (
    <div className="chat">
      <p className="chat__over-title">Room:</p>
      <h1 className="chat__title">{room}</h1>

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
        <div ref={messageEndRef}/>
      </div>

      <div className="chat__footer">
        <input 
          value={currentMessage}
          className="chat__footer__input"
          type="text" 
          placeholder="message..." 
          onChange={e => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className="chat__footer__button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}
