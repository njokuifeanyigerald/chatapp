import React from 'react'
import './input.css';

const Input = ({setMessage,sendMessage, message}) => {
    return (
        <div>
            <form className="form">
                <input 
                    className="input"
                    type="text"
                    placeholder="type a message..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    // onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                />
                <button className="sendButton" onClick={(event) => sendMessage(event)}>send</button>
            </form>
           
        </div>
    )
}

export default Input;
