const users = [];

// Unir usuarios
function userJoin(id, username, room){
    const user = {id, username, room}

    users.push(user);

    return user;
}

// Identificar al usuario actual
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// Funcion para cuando un usuario deja la sala de chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

// Como traer la sala a la que pertenece un usuario
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}