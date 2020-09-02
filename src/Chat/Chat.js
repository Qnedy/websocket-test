import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow/ChatWindow';
import ChatInput from './ChatInput/ChatInput';

const Chat = () => {
    const [ connection, setConnection ] = useState(null);
    const [ chat, setChat ] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://api.test.premepay.com/hub/stores/1/payments/650?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJwYWJsby5wcmVtZSIsInJvbGUiOiJCdXNpbmVzcy5Pd25lciIsIkJ1c2luZXNzIjoiMSIsIlN0b3JlcyI6IlsxXSIsIm5iZiI6MTU5OTA4NzUxNSwiZXhwIjoxNTk5MDkxMTE1LCJpYXQiOjE1OTkwODc1MTV9.dFDOgIH7gU5PC4mDL6LJ4CPOMIDeFA2gsLcQbpf8fMo')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
    
                    connection.on('NewRefund', refund => {
                        console.log(refund);
                        const updatedChat = [...latestChat.current];
                        console.log(updatedChat)
                        updatedChat.push(refund);
                    
                        setChat(updatedChat);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async (user, message) => {
        const chatMessage = {
            user: user,
            message: "teste",
            roomName: "1"
        };

        if (connection.connectionStarted) {
            try {
                await connection.send('JoinRoom', chatMessage.roomName,1,{});
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }

    return (
        <div>
            <ChatInput sendMessage={sendMessage} />
            <hr />
            <ChatWindow chat={chat}/>
        </div>
    );
};

export default Chat;