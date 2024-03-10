import chatStylesDesktop from "../styles/chatDesktop.module.css";
import chatStylesMobile from "../styles/chatMobile.module.css";
import { useEffect, useState, useRef } from "react";
import isMobile from "../utils/isMobile";
import { socket } from "../socket";

interface ChatComponentProps {
    active: boolean;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ active }) => {
    const [chat, setChat] = useState<[string, string][]>([]);
    const [message, setMessage] = useState<string>("");
    const [isMobileView, setIsMobileView] = useState(isMobile.any());
    const [isExpanded, setIsExpanded] = useState(false);
    const [lastMessageTimes, setLastMessageTimes] = useState<number[]>([]);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = () => {
        if (message.trim().length === 0) return;

        if (lastMessageTimes.filter((time) => Date.now() - time < 5000).length >= 3) {
            setChat([...chat, ["SYSTEM", "Vous envoyez trop de messages, veuillez patienter quelques secondes..."]]);
            return;
        }

        lastMessageTimes.push(Date.now());
        if (lastMessageTimes.length > 3) lastMessageTimes.shift();

        setLastMessageTimes(lastMessageTimes);

        // Send message to websocket
        socket.emit("message", message, (success: boolean) => {
            if (success) {
                setChat([...chat, ["MOI", message]]);
            } else {
                setChat([...chat, ["SYSTEM", "Le message n'a pas pu être envoyé..."]]);
            }
        });

        setMessage("");
        setIsExpanded(true);
    };

    const toggleShow = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chat]);

    useEffect(() => {
        // Listen for messages from websocket
        socket.on("message", (email: string, message: string) => {
            setChat([...chat, [email, message]]);
        });

        // Handle window resize
        const handleResize = () => {
            setIsMobileView(isMobile.any());
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [chat]);

    const chatStyles = isMobileView ? chatStylesMobile : chatStylesDesktop;

    return (
        <div className={chatStyles.chat}>
            <div className={`${chatStyles.messages} ${isExpanded && chatStyles.expanded}`} ref={messagesContainerRef}>
                {chat.map((chatMessage, index) => (
                    <div key={index}>
                        {" "}
                        <span>{chatMessage[0]}:</span> {chatMessage[1]}
                    </div>
                ))}
            </div>
            <div className={chatStyles.input}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={active ? "Entrez votre message..." : "Connectez-vous"}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    readOnly={!active}
                />
                {active && (
                    <button onClick={sendMessage}>
                        <img src="/src/assets/paper-plane.svg" alt="logo-avion-papier" />
                    </button>
                )}
                {!isMobileView && (
                    <button onClick={toggleShow} className={isExpanded ? chatStyles.reversed : undefined}>
                        <img src="/src/assets/chevron-down.svg" alt="chevron-down" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatComponent;
