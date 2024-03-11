// import React, { useEffect } from 'react'
import { useState } from "react";
import styles from "../styles/assoModal.module.css";
import Select from "react-select";
// import { JSX } from 'react/jsx-runtime';

const options = [
    { value: "asso1", label: "Association 1" },
    { value: "asso2", label: "Association 2" },
    { value: "asso3", label: "Association 3" },
];

export default function AssoModal() {
    const [selectedOption, setSelectedOption] = useState<{
        value: string;
        label: string;
    } | null>(null);

    const [displayAssoModal, setDisplayAssoModal] = useState(true);

    const handleHide = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        event.preventDefault();
        setDisplayAssoModal(false);
    };

    return (
        <>
            {displayAssoModal && (
                <div className={styles.modalAssoContainer}>
                    {displayAssoModal && (
                        <div className={styles.modalAsso}>
                            <h1>Une asso ?</h1>

                            <p>
                                Si vous faites partie d'une association, entrez
                                la juste ici pour la représenter.
                            </p>

                            <Select
                                defaultValue={selectedOption}
                                onChange={setSelectedOption}
                                options={options}
                            />

                            <button>C'est parti !</button>

                            <a onClick={handleHide}>
                                Je ne suis pas dans une asso
                            </a>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
