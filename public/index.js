const socket = io();

var message = document.getElementById("message");
var room = document.getElementById("room");
var btn = document.getElementById("send");
var joinRoomBtn = document.getElementById("join-room");
var handle = document.getElementById("handle");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");

// on connection
socket.on("connect", () => {
    console.log(`${socket.id} has joined the chat`);
});

// on connection error
socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
});

// Load messages from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("adorable-chat-messages");
    if (saved) output.innerHTML = saved;
});

// Save messages to localStorage whenever output changes
function saveMessages() {
    localStorage.setItem("adorable-chat-messages", output.innerHTML);
}


// event listeners for the send button
btn.addEventListener("click", () => {
    // sending message from the client
    socket.emit("chat", {
        message: message.value,
        handle: handle.value
    });

    output.innerHTML += `<p class="sender-message"><strong>${handle.value}: </strong>${message.value}</p>`;
    // Save message in local storage after adding a message
    saveMessages();
    message.value = ""
});

//EVENT listener for typing
message.addEventListener("keypress", () => {
    socket.emit("typing", {
        handle: handle.value
    });
});


// event listener for join room button
joinRoomBtn.addEventListener("click", (e) => {
  
});

//listening for chat messages from the server
socket.on("receive-message", message => {
    feedback.innerHTML = ""
    output.innerHTML += `<p class="receiver-message"><strong>${message.handle}: </strong>${message.message}</p>`;
    // Saving messages after receiving a message
    saveMessages();
});

//listtening to typing on the client side
socket.on("typing", message => {
    feedback.innerHTML = `<p><em>${message.handle} is typing</em></p>`;
})