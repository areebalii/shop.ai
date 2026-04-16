// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState("");

//   // 1. Initialize state from localStorage if it exists
//   const [messages, setMessages] = useState(() => {
//     const savedMessages = localStorage.getItem("wearwell_chat_history");
//     return savedMessages ? JSON.parse(savedMessages) : [
//       { role: 'bot', text: "Hi! I'm the WearWell assistant. How can I help you today?" }
//     ];
//   });

//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   // 2. Save to localStorage whenever messages change
//   useEffect(() => {
//     localStorage.setItem("wearwell_chat_history", JSON.stringify(messages));
//     if (isOpen) scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { role: 'user', text: input };
//     setMessages(prev => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await axios.post('http://localhost:3000/api/chat/ask', { message: input });
//       if (response.data.success) {
//         setMessages(prev => [...prev, { role: 'bot', text: response.data.reply }]);
//       }
//     } catch (error) {
//       setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting. Please try again." }]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // 3. Clear storage when user hits "Clear Chat"
//   const clearChat = () => {
//     const initialMsg = [{ role: 'bot', text: "Chat cleared! How can I help you?" }];
//     setMessages(initialMsg);
//     localStorage.removeItem("wearwell_chat_history");
//   }

//   return (
//     <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 font-sans flex flex-col items-end">

//       {isOpen && (
//         <div className="bg-white w-[90vw] sm:w-[350px] h-[500px] max-h-[70vh] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">

//           {/* Header */}
//           <div className="bg-slate-900 p-4 text-white flex justify-between items-center shadow-md">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//               <div>
//                 <p className="font-bold text-sm leading-tight">WearWell Assistant</p>
//                 <p className="text-[10px] text-gray-400">Your History Saved</p>
//               </div>
//             </div>
//             <button
//               onClick={clearChat}
//               className="text-gray-400 hover:text-white transition-colors p-1"
//               title="Clear Chat"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//             </button>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//             {messages.map((msg, index) => (
//               <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
//                     ? 'bg-slate-900 text-white rounded-tr-none'
//                     : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
//                   }`}>
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="flex justify-start">
//                 <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
//                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
//                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
//                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
//                 </div>
//               </div>
//             )}
//             <div ref={chatEndRef} />
//           </div>

//           {/* Input Area */}
//           <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-slate-900 outline-none"
//             />
//             <button type="submit" className="bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 transition-transform active:scale-95">
//               <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Toggle Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-slate-900 text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
//       >
//         {isOpen ? (
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
//         ) : (
//           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
//         )}
//       </button>
//     </div>
//   );
// };

// export default Chatbot;

// ahmad gul

import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "I am AI assistant for Wearwell ecommerce website. How can I help you?",
    },
  ]);

  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const updatedChat = [...chat, { sender: "user", text: message }];
    setChat(updatedChat);

    try {
      const res = await fetch("http://localhost:3000/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setChat([
        ...updatedChat,
        { sender: "bot", text: data.output.content },
      ]);

      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const styles = {
    chatContainer: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 1000,
    },
    chatIcon: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#111827",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "24px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    },
    chatBox: {
      width: "420px", // ✅ wider
      height: "520px",
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "Arial, sans-serif",
      marginBottom: "10px",
    },
    header: {
      backgroundColor: "#111827",
      color: "#fff",
      padding: "15px",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    closeBtn: {
      cursor: "pointer",
      fontSize: "18px",
    },
    messages: {
      flex: 1,
      padding: "15px",
      overflowY: "scroll", // ✅ always show scrollbar
      backgroundColor: "#f3f4f6",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#2563eb",
      color: "white",
      padding: "12px 16px",
      borderRadius: "15px 15px 0 15px",
      maxWidth: "85%", // ✅ wider bubbles
      wordWrap: "break-word",
    },
    botMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#e5e7eb",
      padding: "12px 16px",
      borderRadius: "15px 15px 15px 0",
      maxWidth: "85%", // ✅ wider bubbles
      wordWrap: "break-word",
    },
    inputArea: {
      display: "flex",
      borderTop: "1px solid #ddd",
    },
    input: {
      flex: 1,
      padding: "14px",
      border: "none",
      outline: "none",
      fontSize: "14px",
    },
    button: {
      backgroundColor: "#111827",
      color: "white",
      border: "none",
      padding: "0 25px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.chatContainer}>
      {isOpen && (
        <div style={styles.chatBox}>
          <div style={styles.header}>
            Customer Support
            <span
              style={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              ❌
            </span>
          </div>

          <div style={styles.messages}>
            {chat.map((msg, index) => (
              <div
                key={index}
                style={
                  msg.sender === "user"
                    ? styles.userMessage
                    : styles.botMessage
                }
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} style={styles.button}>
              Send
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <div
          style={styles.chatIcon}
          onClick={() => setIsOpen(true)}
        >
          💬
        </div>
      )}
    </div>
  );
};

export default Chatbot;