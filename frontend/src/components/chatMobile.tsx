import styles from '../styles/chatDesktop.module.css';
import { useEffect, useState, useRef } from 'react';

const ChatComponent = () => {
    const [chat, setchat] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);


    const sendMessage = () => {
        setchat([...chat, message]);
        setMessage('');
    }

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chat]);

    
    return (
        <div className={styles.chat}>
            <button className={styles.btnCloseChat}><img src="../assets/paper-plane.svg" alt="croix-fermeture" /></button>
            <div className={styles.messages} ref={messagesContainerRef}>
                {chat.map((message, index) => (
                <div key={index}> <span>pseudo:</span> {message}</div>))}
            </div>
            <div className={styles.input}>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Ecris un message...' />
                <button onClick={sendMessage}><img src="/src/assets/paper-plane.svg" alt="logo-avion-papier" /></button>
            </div>
        </div>
    );
}

export default ChatComponent;
