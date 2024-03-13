import React, { useEffect, useState } from "react";

import styles from "../../styles/modal/Modal.module.css";

interface ModalComponentProps {
    forceOpen?: boolean;
    modalBtnClassName?: string;
    modalBtnContent?: React.ReactNode;
    maxWidth?: number;
    modalComponentClassName?: string;
    titleContent: string;
    titleClassName: string;
    textContent?: string;
    children?: React.ReactNode;
    closeBtnContent: string | React.ReactNode;
    optCloseBtnClassName?: string;
    linkAsCloseBtn?: boolean;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
    forceOpen,
    modalBtnClassName,
    modalBtnContent,
    maxWidth = 400,
    modalComponentClassName,
    titleContent,
    titleClassName,
    textContent,
    children,
    closeBtnContent,
    optCloseBtnClassName,
    linkAsCloseBtn,
}) => {
    const [isOpened, setIsOpened] = useState<boolean>(false);

    const handleOpened = () => {
        setIsOpened(!isOpened);
    };

    useEffect(() => {
        forceOpen && setIsOpened(true);
    }, [forceOpen]);

    return (
        <>
            {modalBtnContent && (
                <button
                    className={[modalBtnClassName].join("")}
                    onClick={handleOpened}
                >
                    {modalBtnContent}
                </button>
            )}
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
                        
                        {linkAsCloseBtn ? (
                            <a onClick={handleOpened}>{closeBtnContent}</a>
                        ) : (
                            <button
                                className={
                                    optCloseBtnClassName
                                        ? [optCloseBtnClassName].join("")
                                        : styles.closeButton
                                }
                                onClick={handleOpened}
                            >
                                {closeBtnContent}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalComponent;
