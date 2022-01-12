import { useState, useEffect } from "react"
import './Chat.scss'

export const Chat = ({socket, username, room}) => {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])

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

  return (
    <div className="chat">
      <h1 className="chat__title">Live Chat</h1>

      <div className="chat__body">
        {messageList.map(message => {
          const messageClass = (message.username === username) ? "--you" : "" 
          const name = (message.username === username) ? "You:" : message.username
          return (
            <div className="chat__body__message">
              <div className="chat__body__message__meta">
                <p className={`chat__body__message__time time${messageClass}`}>{message.time}</p>
                <p className={`chat__body__message__name time${messageClass}`}>{name}</p>
              </div>
              <p className={`chat__body__message__text text${messageClass}`}>{message.message}</p>
            </div>
          )
        })}
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
