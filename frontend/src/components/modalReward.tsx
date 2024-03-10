import { useState } from "react";
import styles from "../styles/modalReward.module.css";

const ModalReward = () => {
    const [isOpened, setIsOpened] = useState(false);

    const handleOpened = () => {
        setIsOpened(!isOpened);
    };
    return (
        <>
            <button
                className={styles.btnModalReward}
                onClick={handleOpened}
            >
                <img src='/src/assets/trophy.svg' />
            </button>
            {isOpened && (
                <div
                    className={styles.modalRewardContainer}
                    onClick={handleOpened}
                >
                    <div className={styles.modalReward}>
                        <h2>Récompenses</h2>
                        <p>
                            Les prix suivants seront remis aux participants
                            ayant posé le plus de pixels
                        </p>
                        <ul>
                            <li>
                                <p>1er prix</p>
                                <img
                                    src='/src/assets/billets-disney.png'
                                    alt='Billets Disney'
                                />
                                <p>2 billets Disney</p>
                            </li>
                            <li>
                                <p>2ème prix</p>
                                <img
                                    src='/src/assets/carte-amazon.png'
                                    alt='Carte Amazon'
                                />
                                <p>1 carte Amazon de 30€</p>
                            </li>
                            <li>
                                <p>3ème prix</p>
                                <img
                                    src='/src/assets/carte-ugc.png'
                                    alt='Carte UGC'
                                />
                                <p>2 cartes solo UGC</p>
                            </li>
                        </ul>
                        <hr />
                        <div className={styles.trophy}>
                            <p>
                                Trophée pour l'asso qui a posé le plus de pixels
                            </p>
                            <img
                                src='/src/assets/trophy_pixel_war.png'
                                alt='Trophée Pixel War'
                            />
                        </div>
                        <p>Les prix seront remis à la fin de l'évènement</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalReward;
