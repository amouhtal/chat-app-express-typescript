const socket = io();
const charForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join chatroom
socket.emit("joinRoom", {username, room});

socket.on("roomUsers", ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
}
);


socket.on("m essage", (message) => {
    console.log(message);
    outputMessage(message);
    chatMessage.scrollTop = chatMessage.scrollHeight;
}
);

charForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get message text
    const msg = e.target.elements.msg.value;
    // Emit message to server
    socket.emit("chatMessage", msg);

    // Clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div); 
}

// Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
}