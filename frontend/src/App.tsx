// import { useState } from 'react'
import { SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./App.module.css";
import { socket } from "./socket";
import classementItem from "../../common/interfaces/classementItem.interface";
import ChatComponent from "./components/chat";
import LeaderboardComponent from "./components/leaderboard";
import LoginComponent from "./components/login";
import ProfilComponent from "./components/profil";
import isMobile from "./utiles/isMobile";
import Canvas from "./components/Canvas";
import Palette from "./components/Palette";
import Timer from "./components/Timer";

function App() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [classement, setClassement] = useState<classementItem[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    // set state to true if testing
    const [isConnected, setIsConnected] = useState(socket.connected);

    const [selectedColor, setSelectedColor] = useState("white");
    const [zoom, setZoom] = useState(1);

    const [userEmail, setUserEmail] = useState("");
    const [displayBtnLogin, setDisplayBtnLogin] = useState(true);
    const [displayComponent, setDisplayComponent] = useState("none");
    const [isMobileView, setIsMobileView] = useState(isMobile.any());

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onclassementUpdate(data: classementItem[]) {
            setClassement(data);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("classementUpdate", onclassementUpdate);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("classementUpdate", onclassementUpdate);
        };
    }, []);

    const handleColorSelect = (color: SetStateAction<string>) => {
        setSelectedColor(color);
    };

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            // Multiplicateur de zoom arbitraire
            const zoomFactor = 0.1;
            // Si la molette de la souris est déplacée vers le haut, zoom avant, sinon zoom arrière
            const newZoom =
                event.deltaY > 0 ? zoom - zoomFactor : zoom + zoomFactor;
            // Limiter le zoom à un minimum de 0.1 pour éviter les valeurs non valides
            setZoom(Math.max(0.1, newZoom));
        };

        window.addEventListener("wheel", handleWheel);

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, [zoom]);

    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let drag = false;
        let canvasX = 0;
        let canvasY = 0;
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseDown = (event: MouseEvent) => {
            if (event.button !== 0) return;
            drag = true;
            setTimeout(() => {
                setIsDragging(true);
            } , 100);
            mouseX = event.clientX;
            mouseY = event.clientY;
        };
        
        const handleMouseMove = (event: MouseEvent) => {
            if (!drag) return;
            // déplacement de la souris
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            canvasX += deltaX;
            canvasY += deltaY;
            mouseX = event.clientX;
            mouseY = event.clientY;
            

            // déplacement du canvas
            canvas.style.left = `${canvasX}px`;
            canvas.style.top = `${canvasY}px`;
        };

        const handleMouseUp = () => {
            drag = false;
            setTimeout(() => {
                setIsDragging(false);
            }, 100);
        };

        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    useEffect(() => {
        const handleResize = (e: Event) => {
            e.preventDefault();
            setIsMobileView(isMobile.any());
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleLogin = (email: string) => {
        setUserEmail(email.split("@")[0]);
        setDisplayBtnLogin(false);
    };

    const handleDisplayComponent = (componentName: string) => {
        if (isMobileView == true) {
            if (displayComponent === componentName) {
                setDisplayComponent("none");
            } else {
                setDisplayComponent(componentName);
            }
        } else {
            if (displayComponent === componentName) {
                setDisplayComponent("none");
            } else {
                setDisplayComponent(componentName);
            }
        }
    };

    // affichage (render)
    return (
        <div>
            <div className={styles.canvasContainer}>
                <Canvas
                    ref={canvasRef}
                    actualColor={selectedColor}
                    zoom={zoom}
                    readOnly={isConnected}
                    stopClick={isDragging}
                />
                {isConnected && <Palette onColorClick={handleColorSelect} />}
                <Timer />
            </div>

            {/* <div id="test-login">
        <LoginComponent />
      </div> */}

            <div className={styles.homepage}>
                {isConnected && (
                    <div className={styles.containerTop}>
                        {isMobile.any() && (
                            <button
                                onClick={() => handleDisplayComponent("chat")}
                                className={styles.btnChat}
                            >
                                <img
                                    src='/src/assets/message.svg'
                                    alt='icone-chat'
                                />
                            </button>
                        )}
                        {displayComponent !== "profil" && (
                            <button
                                onClick={() => handleDisplayComponent("profil")}
                                className={styles.btnProfil}
                            >
                                <img
                                    src='/src/assets/user-large.svg'
                                    alt='icone-user-profil'
                                />
                            </button>
                        )}
                    </div>
                )}

                <LeaderboardComponent />

                {displayBtnLogin && (
                    <button
                        onClick={() => handleDisplayComponent("login")}
                        className={styles.btnLogin}
                    >
                        Login to draw !
                    </button>
                )}

                {displayComponent === "login" && (
                    <LoginComponent onLogin={handleLogin} />
                )}
                {displayComponent === "profil" && (
                    <ProfilComponent
                        userEmail={userEmail}
                        onHideProfil={() => handleDisplayComponent("none")}
                    />
                )}
                {displayComponent === "chat" && (
                    <ChatComponent
                        userEmail={userEmail}
                        active={isConnected}
                    />
                )}
                {!isMobile.any() && (
                    <ChatComponent
                        userEmail={userEmail}
                        active={isConnected}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
