import { useEffect, useRef, useState } from 'react';

function Room({ currentRoom }) {
    const [messageVal, setMessageVal] = useState("");
    const [receivedMessages, setReceivedMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        setMessageVal("");
        setReceivedMessages([]);

        socketRef.current = new WebSocket("ws://localhost:8080");
        const socket = socketRef.current;

        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: "ENTERED_ROOM",
                payload: currentRoom
            }));
        }

        socket.onmessage = (ev) => {
            const data = JSON.parse(ev.data)
            if (data.type === "RECEIVED_MESSAGE") {
                setReceivedMessages(prev => [...prev, data.payload])
            }
        }
    }, [currentRoom])
    
    const sendMessage = () => {
        if (messageVal !== "") {
            const socket = socketRef.current;
            socket.send(JSON.stringify({
                type: "SEND_MESSAGE",
                payload: {
                    room: currentRoom,
                    message: messageVal
                }
            }));
        }
    }

    return (
        <div>
            <p>In room: {currentRoom}</p>
            {receivedMessages.map(msg => <p>{msg}</p>)}
            <input value={messageVal} onChange={e => setMessageVal(e.target.value)} />
            <button onClick={sendMessage}>send</button>
        </div>
    )
}

export default function App() {
    const [currentRoom, setCurrentRoom] = useState(undefined);

    return (
        <div>
            <button onClick={_ => setCurrentRoom(1)}>Room 1</button>
            <button onClick={_ => setCurrentRoom(2)}>Room 2</button>
            <button onClick={_ => setCurrentRoom(3)}>Room 3</button>
            {currentRoom !== undefined && <Room currentRoom={currentRoom} />}
        </div>
    );
}
