// import { useState } from "react";
import styles from "../styles/profil.module.css";

interface ProfilComponentProps {
    userEmail: string | undefined;
    onHideProfil: () => void;
}

const ProfilComponent: React.FC<ProfilComponentProps> = ({ userEmail = "Anonymous", onHideProfil }) => {
    // A UTILISER POUR LE BACKEND
    // const [posedPixel, setposedPixel] = useState(0);
    // const [messageSent, setmessageSent] = useState(0);
    // const [sinceLastMessage, setsinceLastMessage] = useState(0);
    // const [pixelByHour, setPixelByHour] = useState(0);

    const handleClose = () => {
        onHideProfil();
    };

    return (
        <div className={styles.containerProfil}>
            <div className={styles.profilTitle}>
                <p>{userEmail.split("@")[0]}</p>
                <button className={styles.btnClose} onClick={handleClose}>
                    <img src="/src/assets/x.svg" alt="cross-icon" />
                </button>
            </div>
            <div className={styles.containerStats}>
                <div className={styles.blockStats}>
                    {/* <p>{posedPixel}</p> */}
                    <p>Pixel posés</p>
                </div>
                <div className={styles.blockStats}>
                    {/* <p>{messageSent}</p> */}
                    <p>Messages envoyés</p>
                </div>
                <div className={styles.blockStats}>
                    {/* <p>{sinceLastMessage}</p> */}
                    <p>Depuis le dernier pixel posé</p>
                </div>
                <div className={styles.blockStats}>
                    {/* <p>{pixelByHour}</p> */}
                    <p>Pixes par heure (en moyenne)</p>
                </div>
            </div>
            <button className={styles.btnLogOut}>Log out</button>
        </div>
    );
};

export default ProfilComponent;
