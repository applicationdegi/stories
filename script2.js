const chatBox = document.getElementById("chatBox");

// Load previous messages
let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
renderMessages();

function sendMessage() {
  const username = document.getElementById("username").value.trim();
  const messageText = document.getElementById("message").value.trim();

  if (!username || !messageText) return;

  const message = {
    user: username,
    text: messageText,
    time: new Date().toLocaleTimeString()
  };

  messages.push(message);
  localStorage.setItem("chatMessages", JSON.stringify(messages));

  document.getElementById("message").value = "";
  renderMessages();
}

function renderMessages() {
  chatBox.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<strong>${msg.user}</strong>: ${msg.text}
                     <small>(${msg.time})</small>`;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}
