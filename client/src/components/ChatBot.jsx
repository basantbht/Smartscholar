import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

const ChatBot = () => {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Bounce + glow every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500); // animation lasts 0.5s
    }, 4000); // every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setVisible(!visible);
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-10 right-22 z-50 flex flex-col items-end">
        <button
          onClick={handleClick}
          className={`bg-blue-900 text-white w-14 h-14 rounded-full flex items-center justify-center
            transition-transform duration-300
            ${animate ? "scale-110 shadow-[0_0_20px_rgba(59,130,246,0.6)]" : "scale-100 shadow-lg"}
            hover:bg-blue-800`}
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {/* Chat window */}
        {visible && (
          <div className="mt-4 w-72 h-96 bg-white rounded-xl shadow-lg p-4 flex flex-col">
            <h2 className="font-semibold text-blue-900 text-lg mb-2">Chat with us</h2>
            <div className="flex-1 overflow-y-auto border-t border-gray-200 mt-2 p-2">
              <p className="text-gray-500">Hi! How can I help you today?</p>
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              className="mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBot;
