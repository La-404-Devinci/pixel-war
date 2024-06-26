// import { useState } from "react";
import { useEffect, useState } from "react";
import styles from "../styles/profil.module.css";
import { socket } from "../socket";

import iconX from "../assets/x.svg";

interface ProfilComponentProps {
    userEmail: string | undefined;
    onHideProfil: () => void;
}

const ProfilComponent: React.FC<ProfilComponentProps> = ({ userEmail = "Anonymous", onHideProfil }) => {
    const [posedPixel, setPosedPixel] = useState(0);
    const [messageSent, setMessageSent] = useState(0);
    const [association, setAssociation] = useState(null);
    const [sinceLastPixel, setSinceLastPixel] = useState("N/A");
    const [pixelByHour, setPixelByHour] = useState("N/A");

    useEffect(() => {
        socket.on("user-data-update", (data) => {
            setMessageSent(data.messagesSent);
            setPosedPixel(data.placedPixels);
            setAssociation(data.association);

            if (data.lastPixelTime) {
                const placementDelta = (Date.now() - Date.parse(data.lastPixelTime as string)) / 1000; // seconds

                if (placementDelta < 60) {
                    setSinceLastPixel(Math.round(placementDelta) + "s");
                } else if (placementDelta < 3600) {
                    setSinceLastPixel(Math.round(placementDelta / 60) + "m");
                } else if (placementDelta < 86400) {
                    setSinceLastPixel(Math.round(placementDelta / 3600) + "h");
                } else {
                    setSinceLastPixel(Math.round(placementDelta / 86400) + "j");
                }
            } else {
                setSinceLastPixel("N/A");
            }

            const startDelta = (Date.now() - data.startTime) / 1000 / 60 / 60; // hours
            setPixelByHour(Math.round(data.placedPixels / startDelta) + "px/h");
        });

        socket.emit("get-stats");
    }, []);

    const handleClose = () => {
        onHideProfil();
    };

    const handleLogout = () => {
        // Clear 'email' and 'token' cookies
        document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
        return;
    };

    return (
        <div className={styles.containerProfil}>
            <div className={styles.profilTitle}>
                <p>{userEmail.split("@")[0]}</p>
                <button className={styles.btnClose} onClick={handleClose}>
                    <img src={iconX} alt="cross-icon" />
                </button>
            </div>
            <div className={styles.containerGrid}>
                <p>{posedPixel}</p>
                <p>Pixel posés</p>

                <p>{messageSent}</p>
                <p>Messages envoyés</p>

                <p>{sinceLastPixel}</p>
                <p>Depuis le dernier pixel posé</p>

                <p>{pixelByHour}</p>
                <p>Pixes par heure (en moyenne)</p>

                <p>{association ?? "Non affilié"}</p>
                <p>Votre association</p>
            </div>
            <button className={styles.btnLogOut} onClick={handleLogout}>
                Déconnexion
            </button>
        </div>
    );
};

export default ProfilComponent;
