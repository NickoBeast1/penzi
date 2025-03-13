import { useState } from 'react'
import axios from 'axios'


function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    // Append user's message to chatMessages
    const userMsg = { sender: "user", text: inputMessage };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      // Send API request to your main API endpoint
      // Adjust the "sender" value as needed (here we use a hardcoded phone number for testing)
      const response = await axios.post('http://localhost:5000/api/main', {
        sender: "+254700111222 ",
        message: inputMessage
      });
      
      // Append the response from the API as a system message
      const systemMsg = { sender: "system", text: response.data.response || response.data };
      setChatMessages((prev) => [...prev, systemMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = { sender: "system", text: "Error: " + error.message };
      setChatMessages((prev) => [...prev, errorMsg]);
    }
    
    setInputMessage("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Penzi </h1>
      <div style={styles.chatWindow}>
        {chatMessages.map((msg, index) => (
          <div key={index} style={{...styles.messageContainer, justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"}}>
            <span style={{ 
              ...styles.messageBubble, 
              backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#FFF"
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input 
          type="text" 
          value={inputMessage} 
          onChange={(e) => setInputMessage(e.target.value)} 
          style={styles.input}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: "20px auto", padding: 20, fontFamily: "Arial, sans-serif" },
  header: { textAlign: "center" },
  chatWindow: { border: "1px solid #ccc", padding: 10, height: 400, overflowY: "scroll", backgroundColor: "#f5f5f5" },
  messageContainer: { display: "flex", margin: "10px 0" },
  messageBubble: { 
    display: "inline-block", 
    padding: "10px 15px", 
    borderRadius: "15px", 
    border: "1px solid #ccc", 
    maxWidth: "80%" ,
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap"
  },
  inputContainer: { display: "flex", marginTop: 10 },
  input: { flex: 1, padding: 10, fontSize: 16 },
  button: { padding: "10px 20px", fontSize: 16, marginLeft: 10 }
};

export default App;

