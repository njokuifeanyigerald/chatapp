const users = [];

const addUser = ({id, name, room}) => {
    // change name of room that user enters
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // to prevent an existing user to sign in the room again without leaving
    const existingUser = users.find((user)=> user.name === name && user.room === room)
    if (existingUser){
        return {error: 'Username is taken'}
    }

    const user =  {id, name, room};
    users.push(user)
    return {user}
}

const removeUser  = (id) => {
    const index = users.findIndex((user)=> user.id === id);

    if (index !== -1){
        return users.splice(index, 1)[0];
    }

}

const getUser = (id)=> users.find((user) => user.id === id)
const getUsersInRoom = (room)=> users.filter((user) => user.room === room);

module.exports = {addUser,removeUser, getUser,getUsersInRoom}