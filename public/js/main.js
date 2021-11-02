const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Vamos a traer el usuario y la sala desde la URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

// Unir a la sala de chat
socket.emit('joinRoom', {username, room});

// Buscar una sala y sus usuarios
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// Mensaje del servidor
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // Manejar el scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

