import { useState } from "react";
import SimpleSlider from "./carousel";

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
                <div className={styles.modalRewardContainer}>
                    <div className={styles.modalReward}>
                        <h2>Récompenses</h2>
                        <div className={styles.sliderContainer}>
                            <SimpleSlider />
                        </div>
                        <button
                            className={styles.btnClose}
                            onClick={handleOpened}
                        >
                            J'ai compris !
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalReward;
