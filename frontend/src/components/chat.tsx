import styles from '../styles/chat.module.css';
import { useEffect, useState } from 'react';

const ChatComponent = () => {
    const [chat, setchat] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    
    const sendMessage = () => {
        setchat([...chat, message]);
        setMessage('');
    }
    
    return (
        <div className={styles.chat}>
            <div className={styles.messages}>
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
