import React, { useEffect } from "react";

const ChatApp = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/voice_conversation.js"; // Your original JS
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-center font-bold text-2xl mb-4">AI Voice Conversation</h1>
      <div className="flex justify-center gap-4 mb-4">
        <button id="startButton" className="bg-indigo-500 text-white py-2 px-4 rounded">
          Start Conversation
        </button>
        <button id="endButton" className="bg-red-500 text-white py-2 px-4 rounded hidden">
          End Conversation
        </button>
      </div>

      <p id="status" className="text-center mb-2" style={{ display: "none" }}>
        Press Start to Begin
      </p>

      <div id="conversation">
        <h3 className="font-semibold mb-1">Conversation</h3>
        <div
          id="chatBox"
          className="h-[145px] overflow-y-auto bg-gray-50 border border-gray-300 rounded p-4 text-sm whitespace-normal"
          style={{ lineHeight: "1.5rem" }}
        ></div>
      </div>
    </div>
  );
};

export default ChatApp;
