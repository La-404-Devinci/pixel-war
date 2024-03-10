// import { useState } from 'react'
import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { socket } from "./socket";
import ChatComponent from "./components/chat";
import LeaderboardComponent from "./components/leaderboard";
import LoginComponent from "./components/login";
import ProfilComponent from "./components/profil";
import isMobile from "./utils/isMobile";
import Canvas from "./components/Canvas";
import Palette from "./components/Palette";
import Timer from "./components/Timer";
import API from "./utils/api";

function App() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cookies = document.cookie.split(";");
    let email = undefined;
    let isConnected = false;

    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].includes("email")) {
            email = decodeURIComponent(cookies[i].split("=")[1]);
            isConnected = true;
        }
    }

    const [selectedColor, setSelectedColor] = useState(0);

    const [zoom, setZoom] = useState(1);
    const [displayComponent, setDisplayComponent] = useState("none");
    const [isMobileView, setIsMobileView] = useState(isMobile.any());
    const [time, setTime] = useState(0);
    const [colors, setColors] = useState<string[]>([]);

    const setColorsFromAPI = (colors: number[][]) => {
        setColors(colors.map((color) => `rgb(${color.join(",")})`));
    };

    useEffect(() => {
        if (colors.length === 0) {
            API.GET("/canvas/palette").then((res) => {
                setColorsFromAPI(res);
            });
        }

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        socket.on("canvas-palette-update", setColorsFromAPI);

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("canvas-palette-update");
        };
    }, [colors]);

    const handleColorSelect = (color: number) => {
        setSelectedColor(color);
    };

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            // Multiplicateur de zoom arbitraire
            const zoomFactor = 0.1;
            // Si la molette de la souris est déplacée vers le haut, zoom avant, sinon zoom arrière
            const newZoom = event.deltaY > 0 ? zoom - zoomFactor : zoom + zoomFactor;
            // Limiter le zoom à un minimum de 0.1 pour éviter les valeurs non valides
            setZoom(Math.max(0.1, newZoom));
        };

        window.addEventListener("wheel", handleWheel);

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, [zoom]);

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
        socket.emit("placePixel", x, y, selectedColor, (timer: number) => {
            setTime(timer);
        });
    };

    // affichage (render)
    return (
        <div>
            <div className={styles.canvasContainer}>
                <Canvas actualColor={selectedColor} zoom={zoom} readOnly={isConnected} onPlacePixel={handlePlacePixel} palette={colors} />
                {isConnected && <Palette onColorClick={handleColorSelect} colors={colors} />}
                {time > 0 && <Timer time={time} setTime={setTime} />}
            </div>

            <div className={styles.homepage}>
                <LeaderboardComponent />

                {!isConnected && (
                    <button onClick={() => handleDisplayComponent("login")} className={styles.btnLogin}>
                        Login to draw !
                    </button>
                )}

                {displayComponent === "login" && <LoginComponent onLogin={() => {}} />}
                {displayComponent === "profil" && <ProfilComponent userEmail={email} onHideProfil={() => handleDisplayComponent("none")} />}
                {(displayComponent === "chat" || !isMobile.any()) && <ChatComponent active={isConnected} />}

                <div className={styles.containerTop}>
                    {isMobile.any() && (
                        <button onClick={() => handleDisplayComponent("chat")} className={styles.btnChat}>
                            <img src="/src/assets/message.svg" alt="icone-chat" />
                        </button>
                    )}
                    {isConnected && displayComponent !== "profil" && (
                        <button onClick={() => handleDisplayComponent("profil")} className={styles.btnProfil}>
                            <img src="/src/assets/user-large.svg" alt="icone-user-profil" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
