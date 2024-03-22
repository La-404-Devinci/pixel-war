import chatStylesDesktop from "../styles/chatDesktop.module.css";
import chatStylesMobile from "../styles/chatMobile.module.css";
import { useEffect, useState, useRef, useCallback } from "react";
import isMobile from "../utils/isMobile";
import { socket } from "../socket";
import API from "../utils/api";

import iconMessage from "../assets/message.svg";
import iconPaperPlane from "../assets/paper-plane.svg";
import iconChevronDown from "../assets/chevron-down.svg";

interface ChatComponentProps {
    active: boolean;
    userEmail: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ active, userEmail }) => {
    const [chat, setChat] = useState<[string, string][] | undefined>(undefined);
    const [message, setMessage] = useState<string>("");
    const [isMobileView, setIsMobileView] = useState(isMobile.any());
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [lastMessageTimes, setLastMessageTimes] = useState<number[]>([]);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [displayChat, setDisplayChat] = useState<boolean>(false);
    const [notification, setNotification] = useState<boolean>(false);

    const addMessage = useCallback(
        (email: string, message: string) => {
            let name = email;

            // Check if the message is from the user
            if (name === userEmail) name = "MOI";

            // Clean the name (from the email)
            name = name.split("@")[0];
            if (name.length > 10) name = name.slice(0, 10) + "...";

            // Add the message to the chat
            setChat((chat) => (chat ? [...chat, [name, message]] : [[name, message]]));
        },
        [userEmail],
    );

    // Get messages from API
    useEffect(() => {
        if (chat !== undefined) return;
        API.GET("/messages").then((res) => {
            res.map((message: [string, string]) => {
                addMessage(message[0], message[1]);
            });
        });
    }, [chat, addMessage]);

    const sendMessage = () => {
        if (message.trim().length === 0) return;

        if (lastMessageTimes.filter((time) => Date.now() - time < 5000).length >= 3) {
            addMessage("SYSTEM", "Vous envoyez trop de messages, veuillez patienter quelques secondes...");
            return;
        }

        lastMessageTimes.push(Date.now());
        if (lastMessageTimes.length > 3) lastMessageTimes.shift();

        setLastMessageTimes(lastMessageTimes);

        // Send message to websocket
        socket.emit("message", message, (success: boolean) => {
            if (!success) {
                addMessage("SYSTEM", "Le message n'a pas pu être envoyé...");
            }
        });

        setMessage("");
        setIsExpanded(true);
    };

    const toggleShow = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleChat = () => {
        setDisplayChat(!displayChat);
        setNotification(false);
    };

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }

        // Listen for messages from websocket
        socket.on("message", (email: string, message: string) => {
            addMessage(email, message);
            if (isExpanded) return;
            setNotification(true);
        });

        // Handle window resize
        const handleResize = () => {
            setIsMobileView(isMobile.any());
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            socket.off("message");
        };
    }, [addMessage, isExpanded]);

    useEffect(() => {
        !isMobileView && setDisplayChat(true);
    }, [isMobileView]);

    const chatStyles = isMobileView ? chatStylesMobile : chatStylesDesktop;

    console.log(notification);

    return (
        <>
            {isMobileView && (
                <button onClick={toggleChat} className={chatStyles.btnChat + " " + (displayChat ? chatStyles.active : "")}>
                    <img src={iconMessage} alt="icone-chat" />
                    {notification && <div className={chatStyles.notification}></div>}
                </button>
            )}

            {displayChat && (
                <div className={chatStyles.chat}>
                    <div className={`${chatStyles.messages} ${isExpanded && chatStyles.expanded}`} ref={messagesContainerRef}>
                        {chat?.map((chatMessage, index) => (
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
                                <img src={iconPaperPlane} alt="logo-avion-papier" />
                            </button>
                        )}
                        {!isMobileView && (
                            <button onClick={toggleShow} className={isExpanded ? chatStyles.reversed : undefined}>
                                <img src={iconChevronDown} alt="chevron-down" />
                            </button>
                        )}
                        {notification && <div className={chatStyles.notification}></div>}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatComponent;
