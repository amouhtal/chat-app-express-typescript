const socket = io();
const charForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const userName = document.getElementById("userName");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
// const sender = username === 'user1' ? 'user2' : 'user1';
const receiver = username === 'user1' ? 'user2' : 'user1';
userName.innerHTML = 'receiver ' + receiver;
//Join chatroom
socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on("message", (message) => {
    console.log('message', message);
    outputMessage(message);
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

charForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get message text
    const msg = e.target.elements.msg.value;
    // Emit message to server
    console.log('msg', msg)
    socket.emit("chatMessage", msg, username, receiver);

    // Clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
    outputMessage2(msg);
});

// Output message to DOM
function outputMessage(message) {
    console.log('message', message)
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}
function outputMessage2(message) {
    console.log('message', message)
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${username} <span>${moment().format("h:mm a")}</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}
// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}
