import React, { useState } from "react";

import styles from "../../styles/Modal.module.css";

interface ModalComponentProps {
    modalBtnClassName?: string;
    modalBtnContent: React.ReactNode;
    maxWidth?: number;
    modalComponentClassName?: string;
    titleContent: string;
    titleClassName: string;
    textContent?: string;
    children?: React.ReactNode;
    closeBtnContent: string | React.ReactNode;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
    modalBtnClassName,
    modalBtnContent,
    maxWidth = 400,
    modalComponentClassName,
    titleContent,
    titleClassName,
    textContent,
    children,
    closeBtnContent,
}) => {
    const [isOpened, setIsOpened] = useState(false);

    const handleOpened = () => {
        setIsOpened(!isOpened);
    };

    return (
        <>
            <button
                className={[modalBtnClassName].join("")}
                onClick={handleOpened}
            >
                {modalBtnContent}
            </button>
            {isOpened && (
                <div className={styles.modalContainer}>
                    <div
                        className={[styles.modal, modalComponentClassName].join(
                            " "
                        )}
                        style={{ maxWidth }}
                    >
                        <h2 className={titleClassName}>{titleContent}</h2>

                        {textContent && <p>{textContent}</p>}

                        {children}

                        <button
                            className={styles.closeButton}
                            onClick={handleOpened}
                        >
                            {closeBtnContent}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalComponent;
