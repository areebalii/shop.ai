import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState(() => {
    // Optional: Load previous session history from storage if desired
    const saved = localStorage.getItem("wearwell_chat");
    return saved ? JSON.parse(saved) : [
      {
        sender: "bot",
        text: "Hi! I am the Wearwell AI assistant. How can I help you with your order, sizes, or collections today?",
      },
    ];
  });

  const messagesEndRef = useRef(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("wearwell_chat", JSON.stringify(chat));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    const updatedChat = [...chat, { sender: "user", text: userMessage }];
    setChat(updatedChat);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setChat([
        ...updatedChat,
        {
          sender: "bot",
          // 🚀 FIXED: Point directly to data.reply instead of data.output.content
          text: data.success ? data.reply : "I'm having trouble retrieving that information right now."
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear this conversation history?")) {
      const initial = [{ sender: "bot", text: "Chat history cleared. How can I help you now?" }];
      setChat(initial);
      localStorage.removeItem("wearwell_chat");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1000] font-sans flex flex-col items-end">
      {/* --- Chat Window Container --- */}
      {isOpen && (
        <div className="bg-white w-[92vw] sm:w-[400px] h-[550px] max-h-[80vh] rounded-2xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-6 duration-300">

          {/* Header Panel */}
          <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide">Wearwell Support</h3>
                <p className="text-[10px] text-slate-400">AI Assistant • Online</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Reset History Action */}
              <button
                onClick={clearChat}
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              {/* Close Panel Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-xl leading-none font-light p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-3.5 scrollbar-thin scrollbar-thumb-gray-200">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-sm break-words tracking-wide ${msg.sender === "user"
                      ? "bg-slate-900 text-white rounded-tr-none font-light"
                      : "bg-white border border-slate-100 text-slate-800 rounded-tl-none font-normal"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Stream Typing State */}
            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-duration:1s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Submission Deck */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about sizes, shipping, or products..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${message.trim() && !isLoading
                  ? "bg-slate-900 text-white hover:bg-black active:scale-95"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
            >
              <svg className="w-4 h-4 transform rotate-45 -translate-x-[1px] translate-y-[1px]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* --- Floating Toggle Action Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white w-14 h-14 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer relative group border border-slate-800"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
          </>
        )}
      </button>
    </div>
  );
};

export default Chatbot;