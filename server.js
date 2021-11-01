const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
const formatMessage = require('./utils/messages');

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Configuramos la ruta de archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'NucbaChat Bot';

// Ejecutar cuando un cliente se conecta
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Le damos la bienvenida al nuevo usuario que se unio a la sala
        socket.emit('message', formatMessage(botName, '¡Allá le estan dando la bienvenida!'));

        // Mostrar cuando un usuario se conecta
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `Alla ${user.username} la estan sumando =)`)
            );
        
        // Enviar usuarios e información de la sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Escuchar por mensajes en el chat
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Ejecutar la siguiente funcion cuando un cliente se desconecta.
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} ¿seguro que queres irte?, ok.`)
            );

            // Enviar usuarios e información de la sala
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))