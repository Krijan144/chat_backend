const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chat");
const socket = io.connect("http://localhost:4000");
//var socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//console.log(username);

socket.emit("joinroom", { username, room });

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  //scrolling property
  //chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  //console.log(msg);
  socket.emit("chatMessage", msg);
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}</p>
            <p class="text">${message.text}</p>
            <span class="text">${message.time}</p>`;

  document.getElementById("chat").appendChild(div);
}
