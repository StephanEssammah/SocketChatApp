import { useState, useEffect } from "react"
import './Chat.css'

export const Chat = ({socket, username, room}) => {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const sendMessage = async () => {
    console.log('run')
    if (currentMessage !== "") {
      const messageData = {
        username,
        room,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }
      await socket.emit("send_message", messageData)
      setMessageList((prevList) => [...prevList, {...messageData, class: 'you'} ])
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((prevList) => [...prevList, data])
    })
  }, [socket])

  return (
    <div>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>

      <div className="chat-body">
        {messageList.map(message => {
          return <h1 className={message.class}>{message.message}</h1>
        })}
      </div>

      <div className="chat-footer">
        <input 
          type="text" 
          placeholder="message..." 
          onChange={e => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}
