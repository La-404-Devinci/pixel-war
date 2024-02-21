import { useState } from "react";
import styles from '../styles/profil.module.css';

interface ProfilComponentProps {
    userEmail: string;
    onHideProfil: () => void;
}

const ProfilComponent: React.FC<ProfilComponentProps> = ({userEmail, onHideProfil}) => {

    const [pixelPoses, setPixelPoses] = useState(0);
    const [messagesEnvoyes, setMessagesEnvoyes] = useState(0);
    const [depuisDernierPixel, setDepuisDernierPixel] = useState(0);
    const [pixesParHeure, setPixesParHeure] = useState(0);

    const handleClose = () => {
        onHideProfil();
    }

    return (
        <div className={styles.containerProfil}>
            <div className={styles.profilTitle}>
                <h4>{userEmail}</h4>
                <button className={styles.btnClose} onClick={handleClose}><img src="/src/assets/x.svg" alt="cross-icon" /></button>
            </div>
            <div className={styles.containerStats}>
                <div className={styles.blockStats}>
                    <p>{pixelPoses}</p>
                    <p>Pixel posés</p>
                </div>
                <div className={styles.blockStats}>
                    <p>{messagesEnvoyes}</p>
                    <p>Messages envoyés</p>
                </div>
                <div className={styles.blockStats}>
                    <p>{depuisDernierPixel}</p>
                    <p>Depuis le dernier pixel posé</p>
                </div>
                <div className={styles.blockStats}>
                    <p>{pixesParHeure}</p>
                    <p>Pixes par heure (en moyenne)</p>
                </div>
            </div>
            <button className={styles.btnLogOut}>Log out</button>
        </div>
    )
}

export default ProfilComponent;