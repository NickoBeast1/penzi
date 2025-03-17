import React, { useState } from 'react'
import axios from 'axios'

function App() {
  // 1️⃣ State for login & phone number
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 2️⃣ Chat state
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")

  // 3️⃣ Handle Login
  const handleLogin = () => {
    if (phoneNumber.trim() !== "") {
      setIsLoggedIn(true)
    }
  }

  // 4️⃣ Send Chat Message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user's message to chat
    const userMessage = {
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setChatMessages(prev => [...prev, userMessage])

    try {
      // Post request to your main endpoint
      const response = await axios.post("http://localhost:5000/api/main", {
        sender: phoneNumber,
        message: inputMessage
      })

      // System response
      const systemMsgText = response.data.response || response.data
      const systemMessage = {
        sender: "system",
        text: systemMsgText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, systemMessage])
    } catch (error) {
      const errorMsg = {
        sender: "system",
        text: "Error: " + error.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, errorMsg])
    }

    setInputMessage("")
  }

  // 5️⃣ If Not Logged In, Show Login Screen
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-red-500 p-4">
        <div className="bg-white bg-opacity-90 rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
          <img src="/penzi.png" alt="Penzi Logo" className="mx-auto mb-4 w-16 h-16" />
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome to Penzi</h1>
          <p className="text-gray-600 mb-6">Find Your Perfect Match Today!</p>
          
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="+254712345678"
          />
          
          <button
            onClick={handleLogin}
            className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition-colors font-semibold"
          >
            Login
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            We only use your phone number to connect you with potential matches securely.
          </p>
        </div>
      </div>
    )
  }

  // 6️⃣ If Logged In, Show Enhanced Chat Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400 to-teal-400 flex items-center justify-center p-6">
      {/* Chat Container */}
      <div className="w-full max-w-xl bg-white bg-opacity-90 rounded-2xl shadow-2xl p-6 flex flex-col h-[650px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img
              src="/penzi.png" // or your new transparent icon
              alt="Penzi Logo"
              className="w-8 h-8 object-cover rounded-full"
            />
            <h1 className="text-pink-600 font-bold text-xl">Penziiiii</h1>
          </div>
          <span className="text-sm text-gray-700 italic">Find your perfect match</span>
        </div>

        {/* Messages */}
        <div className="overflow-y-auto mb-4 flex-1 pr-2">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end my-2 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`relative max-w-[65%] rounded-lg px-4 py-3 break-words shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-pink-500 text-white'
                    : 'bg-yellow-300 text-black'
                }`}
              >
                <div>{msg.text}</div>
                {/* Timestamp */}
                <div className="text-xs text-black text-opacity-70 mt-1 flex justify-end">
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex">
          <input
            type="text"
            className="flex-1 rounded-l-lg px-4 py-2 text-black outline-none"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            // Press Enter to send
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-r-lg font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
