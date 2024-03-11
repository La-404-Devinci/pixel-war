import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { socket } from "./socket";
import ChatComponent from "./components/chat";
import LeaderboardComponent from "./components/leaderboard";
import ModalReward from "./components/modalReward";
import LoginComponent from "./components/login";
import ProfilComponent from "./components/profil";
import isMobile from "./utils/isMobile";
import Canvas from "./components/Canvas";
import Palette from "./components/Palette";
import Timer from "./components/Timer";
import API from "./utils/api";
import AssoModal from "./components/AssoModal";

function App() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cookies = document.cookie.split(";");
    let email = undefined;
    let token = undefined;

    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].includes("email")) {
            email = decodeURIComponent(cookies[i].split("=")[1]);
        } else if (cookies[i].includes("token")) {
            token = decodeURIComponent(cookies[i].split("=")[1]);
        }
    }

    const isConnected = email !== undefined && token !== undefined;
    const [socketConnected, setSocketConnected] = useState(false);

    const [selectedColor, setSelectedColor] = useState(0);
    const [displayComponent, setDisplayComponent] = useState("none");
    const [isMobileView, setIsMobileView] = useState(isMobile.any());
    const [colors, setColors] = useState<string[] | undefined>(undefined);
    const [time, setTime] = useState(0);

    const setColorsFromAPI = (colors: number[][]) => {
        setColors(colors.map((color) => `rgb(${color.join(",")})`));
    };

    // Socket events
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
            // Authentification
            if (!token || !email) {
                console.error("Missing token or email");
                setSocketConnected(true);
                return;
            }

            socket.emit("auth", token, email);
            socket.emit("get-classement");
            socket.emit("get-stats");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        socket.on("auth-callback", (success: boolean) => {
            if (!success) {
                console.error("Authentification failed");
                // Clear 'email' and 'token' cookies
                document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.reload();
                return;
            } else {
                setSocketConnected(true);
            }
        });

        socket.on("canvas-palette-update", setColorsFromAPI);

        const statsInterval = setInterval(() => {
            socket.emit("get-stats");
        }, 1000 * 60 * 5); // 5 minutes

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("auth-callback");
            socket.off("canvas-palette-update");
            clearInterval(statsInterval);
        };
    }, [token, email]);

    // Initial fetch of the palette
    useEffect(() => {
        if (!colors) {
            API.GET("/canvas/palette").then((res) => {
                setColorsFromAPI(res);
            });
        }
    }, [colors]);

    // Handle window resize
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let drag = false;
        let canvasX = 0;
        let canvasY = 0;
        let moveX = 0;
        let moveY = 0;

        const handleMouseDown = (event: MouseEvent) => {
            if (event.button !== 0) return;
            handleDown(event.clientX, event.clientY);
        };

        const handleTouchStart = (event: TouchEvent) => {
            if (event.touches.length !== 1) return;
            handleDown(event.touches[0].clientX, event.touches[0].clientY);
        };

        const handleDown = (x: number, y: number) => {
            drag = true;
            setTimeout(() => {
                setIsDragging(true);
            }, 100);
            moveX = x;
            moveY = y;
        };

        const handleMouseMove = (event: MouseEvent) => {
            handleMove(event.clientX, event.clientY);
        };

        const handleTouchMove = (event: TouchEvent) => {
            handleMove(event.touches[0].clientX, event.touches[0].clientY);
        };

        const handleMove = (x: number, y: number) => {
            if (!drag) return;
            // déplacement de l'utilisateur
            const deltaX = x - moveX;
            const deltaY = y - moveY;

            canvasX += deltaX;
            canvasY += deltaY;
            moveX = x;
            moveY = y;

            // déplacement du canvas
            canvas.style.left = `${canvasX}px`;
            canvas.style.top = `${canvasY}px`;
        };

        const handleUp = () => {
            drag = false;
            setTimeout(() => {
                setIsDragging(false);
            }, 100);
        };

        // Desktop events
        window.addEventListener("mouseup", handleUp);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);

        // Mobile events
        window.addEventListener("touchend", handleUp);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchstart", handleTouchStart);
        return () => {
            // Desktop events
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleUp);
            window.removeEventListener("mousedown", handleMouseDown);

            // Mobile events
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleUp);
            window.removeEventListener("touchstart", handleTouchStart);
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

    if (!colors || !socketConnected) {
        return <div>Loading...</div>;
    }

    const handleColorSelect = (color: number) => {
        setSelectedColor(color);
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

    const handlePlacePixel = (x: number, y: number) => {
        socket.emit("place-pixel", x, y, selectedColor, (expiresAt: number) => {
            const timer = Math.floor((expiresAt - new Date().getTime()) / 1000) + 1;
            setTime(timer);
        });
    };

    return (
        <>
            <div className={styles.canvasContainer}>
                <Canvas
                    ref={canvasRef}
                    actualColor={selectedColor}
                    readOnly={!isConnected}
                    stopClick={isDragging}
                    onPlacePixel={handlePlacePixel}
                    palette={colors}
                />
                {isConnected && (
                    <Palette onColorClick={handleColorSelect} colors={colors} selectedColor={selectedColor} isActive={time <= 0} />
                )}
                <Timer time={time} setTime={setTime} />
            </div>

            <div className={styles.homepage}>
                <div className={styles.modalAssoContainer}>
                    <AssoModal />
                </div>

                <div className={styles.leaderboard}>
                    <LeaderboardComponent />
                    <ModalReward />
                </div>
            </div>

            {!isConnected && (
                <button onClick={() => handleDisplayComponent("login")} className={styles.btnLogin}>
                    Connectez-vous pour dessiner !
                </button>
            )}

            {displayComponent === "login" && <LoginComponent onClose={() => handleDisplayComponent("none")} />}
            {displayComponent === "profil" && <ProfilComponent userEmail={email} onHideProfil={() => handleDisplayComponent("none")} />}
            {(displayComponent === "chat" || !isMobile.any()) && <ChatComponent active={isConnected} userEmail={email ?? "N/A"} />}

            {displayComponent !== "profil" && (
                <div className={styles.containerTop}>
                    {isMobile.any() && (
                        <button onClick={() => handleDisplayComponent("chat")} className={styles.btnChat}>
                            <img src="/src/assets/message.svg" alt="icone-chat" />
                        </button>
                    )}
                    {isConnected && displayComponent !== "chat" && (
                        <button onClick={() => handleDisplayComponent("profil")} className={styles.btnProfil}>
                            <img src="/src/assets/user-large.svg" alt="icone-user-profil" />
                        </button>
                    )}
                </div>
            )}
        </>
    );
}

export default App;
