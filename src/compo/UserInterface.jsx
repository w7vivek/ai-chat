import { useState } from "react";
import "./UserInterface.css";

import React from 'react'

function UserInterface({onSubmitData}) {
    const[input,setInput]=useState("");
    const [loading, setLoading] = useState(false);
    const handleNewChat = () => {
  window.location.reload();
};


    const[message,setMessages]=useState([
        {
            id:1,
            role:"user",
            text:"Explain useState in React.js"
        },
        {
            id:2,
            role:"ai",
            text:"..."
        }
    ]);
    const handleSubmit= async (e)=>{
        e.preventDefault();  //Stop load data

        const userData={
            input
        };
        onSubmitData(userData);
        

        if (!input.trim() || loading) return;   // ignore while loading

        setLoading(true);

        const newMsg={
            id: Date.now(),
            role:"user",
            text:input
        };
        setMessages((newArray) => [...newArray,newMsg]);

        const currentInput=input;
        setInput("");
        try{
            // 2) Call your backend AI endpoint
            const res=await fetch("https://ai-chat-api-production.up.railway.app/api/reply",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: currentInput }),
            });

            const data=await res.json();
            console.log("backend reply:", data);

            // Any error
            if (!res.ok) { // ✅ use 'res'
                throw new Error(data.error || "Provider returned error");
            }

            
            const aiMsg={
                id: Date.now() + 1,
                role: "ai",
                text: data.reply, // whatever your backend returns
            };
            setMessages((prev) => [...prev, aiMsg]);
        }catch (err) {
            console.error("React AI error:", err);
        const errorMsg = {
        id: Date.now() + 2,
        role: "ai",
        text: "Sorry, something went wrong calling the AI.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }finally {
    setLoading(false);       // allow next prompt
  }

    };
  return (
    <form onSubmit={handleSubmit} className="parent">
        
    <div className="sidebar"> {/* Left column */}
    <div className="logo">AI Chat</div>
    <button className="new-chat" onClick={handleNewChat}>+ New chat</button>
    <div className="history-title">Recent</div>
    <ul className="history-list">
      <li>How to learn React?</li>
      <li>Explain closures in JS</li>
    </ul>
  </div>

  <div className="chat-area"> {/* Middle main area */}
    <div className="chat-header">
      <span className="model-name">GPT‑4.5 Sun</span>
      <span className="status-dot"></span>
      <span className="status-text">Online</span>
    </div>

    <div className="messages">
        {message.map((m)=>(
            <div
            key={m.id}
            className={`message ${m.role=== "user"? "user" : "ai" }`}>

                <div className="avatar">
                    {m.role==="user" ? "U" : "Ai"}
                </div>
                <div className="bubble">{m.text}</div>
            </div>
        ))}
      </div>

      <div className="message ai suggestion">
        <div className="bubble pills">
          <button>Explain with code</button>
          <button>Give real‑world example</button>
          <button>Optimize this hook</button>
        </div>
      </div>
    </div>

  <div className="composer"> {/* Bottom input bar */}
    <input
      type="text"
      placeholder="Send a message..."
      className="prompt-input"
      onChange={(e) => setInput(e.target.value)}
      disabled={loading}
    />
    <button className="send-btn" type="submit" disabled={loading}>
  {loading ? "Thinking..." : "Send"}</button>
  </div>
    </form>
    
  )
}
;
export default UserInterface;