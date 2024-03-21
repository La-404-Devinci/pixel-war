import SimpleSlider from "../slider";
import ModalComponent from "./Modal";

import styles from "../../styles/reward.module.css";
import iconTrophy from "../../assets/trophy.svg";

const ModalReward = () => {
    return (
        <>
            <ModalComponent
                modalBtnClassName={styles.btnModalReward}
                modalBtnContent={<img src={iconTrophy} alt="Trophy Modal Button" />}
                maxWidth={1000}
                modalComponentClassName={styles.modalReward}
                titleContent="Récompenses"
                titleClassName={styles.modalRewardTitle}
                closeBtnContent="J'ai compris !"
            >
                <div className={styles.sliderContainer}>
                    <SimpleSlider />
                </div>
            </ModalComponent>
        </>
    );
};

export default ModalReward;
