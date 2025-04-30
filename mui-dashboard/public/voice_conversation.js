document
  .getElementById("startButton")
  .addEventListener("click", startConversation);
document.getElementById("endButton").addEventListener("click", endConversation);

const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();

recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;

let conversationActive = false;
let aiTurn = false;

function startConversation() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("endButton").style.display = "inline";
  document.getElementById("status").textContent = "You start speaking first...";
  conversationActive = true;
  recognition.start();
}

function endConversation() {
  conversationActive = false;
  document.getElementById("endButton").style.display = "none";
  document.getElementById("status").textContent = "Conversation ended.";

  // Hide ripple effect if active
  document.getElementById("rippleContainer").classList.add("hidden");
}

recognition.onresult = function (event) {
  if (!conversationActive) return;

  let userSpeech = event.results[0][0].transcript;
  updateChat("You", userSpeech);
  aiTurn = true;

  fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_input: userSpeech }),
  })
    .then((response) => response.json())
    .then((data) => {
      speak(data.ai_response);
    })
    .catch((error) => console.error("Error:", error));
};

recognition.onspeechend = function () {
  if (!conversationActive) return;
  setTimeout(() => {
    if (aiTurn) return; // AI is speaking, so don't trigger again
    fetch("/api/continue")
      .then((response) => response.json())
      .then((data) => {
        speak(data.ai_response);
      });
  }, 3000);
};

recognition.onerror = function (event) {
  console.error("Speech recognition error:", event.error);
};

function speak(text) {
  aiTurn = true;
  updateChat("AI", text);
  // Show the ripple effect
  let rippleContainer = document.getElementById("rippleContainer");
  rippleContainer.classList.remove("hidden");

  let speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";

  speech.onend = () => {
    // Hide the ripple effect when speech ends
    rippleContainer.classList.add("hidden");
    aiTurn = false;
    recognition.start(); // Resume listening after AI speaks
  };

  window.speechSynthesis.speak(speech);
}

function updateChat(speaker, message) {
  let chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `<p><strong>${speaker}:</strong> ${message}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}
