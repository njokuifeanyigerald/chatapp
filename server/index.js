const express = require('express');
const socketio = require('socket.io');
const http = require('http')
const router = require('./router');
const {addUser, removeUser,getUser,getUsersInRoom} = require('./user')
const cors = require('cors');
const app = express();

const PORT  = process.env.PORT || 4000
const server = http.createServer(app);
app.use(router)
app.use(cors())

const io = socketio(server);

io.on('connection', (socket)=>{
    console.log('we have a new connection')
    socket.on('join', ({name, room}, callback)=> {
        const {error, user} = addUser({id: socket.id, name, room})

        if(error) return callback(error);
        socket.join(user.room);
        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to ${user.room}`});
        socket.broadcast.to(user.room).emit('message',{user: 'admin', text: `${user.name} has joined`})

        
        // to know number of users in a room
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        callback();

    });
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
    
        io.to(user.room).emit('message', { user: user.name, text: message });
    
        callback();
    });

    

    // user leaves
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        // when ever user leaves the room, admin sends message to the group
        if(user){
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left`})
             //  know the current amount of users in a  group when you leave
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
        
        console.log('user has left')
    });
});



server.listen(PORT, ()=> console.log(`server has started on ${PORT}`))