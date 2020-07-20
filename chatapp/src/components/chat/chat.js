import React, {useEffect,useState} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './chat.css';
import InfoBar from '../infoBar/infobar';
import Input from '../input/input';
import Messages from '../messages/messages'
import TextContainer from '../TextContainer/textContainer'



let socket;

const Chat = ({location}) => {
    const BackEnd = 'localhost:4000';
    const [name, setName] = useState('');
    const [users, setUsers] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const {name,room} = queryString.parse(location.search);
        socket = io(BackEnd)
        setName(name);
        setRoom(room);
        socket.emit('join', {name, room}, () => {

        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    },[BackEnd, location.search]);

    useEffect(() => {
        socket.on('message',(message) => {
            setMessages([...messages, message]);
        })
        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
    }, [])
    const sendMessage = (event) =>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message , () => setMessage(''));
        }
        
    }
    console.log(message, messages)
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar  room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat;