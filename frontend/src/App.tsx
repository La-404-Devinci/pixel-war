import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { socket } from "./socket";
import ChatComponent from "./components/chat";
import LeaderboardComponent from "./components/leaderboard";
import ModalReward from "./components/modal/reward";
import LoginComponent from "./components/modal/login";
import ProfilComponent from "./components/profil";
import isMobile from "./utils/isMobile";
import Canvas from "./components/Canvas";
import Palette from "./components/Palette";
import Timer from "./components/Timer";
import AssoModal from "./components/modal/asso";
import API from "./utils/api";

import iconUserLarge from "./assets/user-large.svg";
import ToastComponent from "./components/toast";

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
            socket.emit("get-classement");

            // Authentification
            if (!token || !email) {
                console.error("Missing token or email");
                // setSocketConnected(true);
                return;
            }

            socket.emit("auth", token, email);
            socket.emit("get-stats");
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
                // setSocketConnected(true);
            }
        });

        socket.on("force-refresh", () => {
            window.location.reload();
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

    // if (!colors || !socketConnected) {
    //     return <div>Loading...</div>;
    // }

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
        socket.emit("place-pixel", x, y, selectedColor, (expiresIn: number) => {
            const expiresAt = new Date().getTime() + expiresIn - 1000;
            setTime(expiresAt);
        });
    };

    return (
        <>
            <div className={styles.canvasContainer}>
                <Canvas actualColor={selectedColor} readOnly={!isConnected} onPlacePixel={handlePlacePixel} palette={colors ?? []} />
                {isConnected && <Palette onColorClick={handleColorSelect} colors={colors} selectedColor={selectedColor} time={time} />}
                <Timer time={time} />
            </div>

            <ToastComponent />

            <div className={styles.navbarContainer}>
                <LeaderboardComponent />
                <ModalReward />
                {!isConnected && <LoginComponent />}
                <ChatComponent active={isConnected} userEmail={email ?? "N/A"} />

                {/* Profile button */}
                {isConnected && displayComponent !== "chat" && (
                    <button onClick={() => handleDisplayComponent("profil")} className={styles.btnProfil}>
                        <img src={iconUserLarge} alt="icone-user-profil" />
                    </button>
                )}
            </div>

            {displayComponent === "profil" && <ProfilComponent userEmail={email} onHideProfil={() => handleDisplayComponent("none")} />}

            <AssoModal />
        </>
    );
}

export default App;
