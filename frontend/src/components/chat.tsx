import chatStylesDesktop from '../styles/chatDesktop.module.css'
import chatStylesMobile from '../styles/chatMobile.module.css'
import { useEffect, useState, useRef } from 'react'
import isMobile from '../utiles/isMobile'

interface ChatComponentProps {
    userEmail: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({userEmail}) => {
    const [chat, setchat] = useState<string[]>([])
    const [message, setMessage] = useState<string>('')
    const [isMobileView, setIsMobileView] = useState(isMobile.any())
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)


    const sendMessage = () => {
        setchat([...chat, message])
        setMessage('')
    }

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [chat])

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(isMobile.any())
        };

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, [])

    const chatStyles = isMobileView ? chatStylesMobile : chatStylesDesktop
    
    return (
        <div className={chatStyles.chat}>
            <div className={chatStyles.messages} ref={messagesContainerRef}>
                {chat.map((message, index) => (
                <div key={index}> <span>{userEmail}:</span> {message}</div>))}
            </div>
            <div className={chatStyles.input}>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Ecris un message...' />
                <button onClick={sendMessage}><img src="/src/assets/paper-plane.svg" alt="logo-avion-papier" /></button>
            </div>
        </div>
    );
}

export default ChatComponent
