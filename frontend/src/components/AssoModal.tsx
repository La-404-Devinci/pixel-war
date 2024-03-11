// import React, { useEffect } from 'react'
import { useState } from "react";
import styles from "../styles/assoModal.module.css";
import AsyncSelect from "react-select/async";

// import { JSX } from 'react/jsx-runtime';

const options = [
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/iimpact/logos/Logo-Monochrome-avec-NOUVELLE-ecriture-630fc58ce8a48.png",
        label: "IIMPACT",
        value: "iimpact",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/3v/logos/LogoFullColor-MaelleLemaignen-61191bd85b6f7.png",
        label: "3V",
        value: "3v",
    },
    {
        image: "https://www.forum-associatif-numerique.fr/uploads/vincisquad/logos/1-Logo-Couleurs-631c4239386ae.png",
        label: "Vinci Squad",
        value: "vincisquad",
    },
];

export default function AssoModal() {
    const [displayAssoModal, setDisplayAssoModal] = useState(true);
    const [selectedAsso, setSelectedAsso] = useState(null);

    const handleHide = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        event.preventDefault();
        setDisplayAssoModal(false);
    };

    type CustomMenuProps = {
        children: React.ReactNode;
    };

    const customMenu = (props: CustomMenuProps) => {
        return (
            <div className={styles.menu}>
                <div>{props.children}</div>
            </div>
        );
    };

    type Option = {
        image: string;
        label: string;
        value: string;
    };

    const filterAsso = (inputValue: string) => {
        return options.filter((i: Option) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const loadOptions = (
        inputValue: string,
        callback: (options: Option[]) => void
    ) => {
        setTimeout(() => {
            callback(filterAsso(inputValue));
        }, 1000);
    };

    type CustomOptionProps = {
        data: Option;
    };

    const customOption = (props: CustomOptionProps) => {
        return (
            <div className={styles.option}>
                <p>{props.data.label}</p>
                <img
                    src={props.data.image}
                    alt={props.data.label}
                />
            </div>
        );
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

                            <AsyncSelect
                                placeholder='Choisissez votre association !'
                                loadOptions={loadOptions}
                                defaultOptions
                                components={{
                                    Menu: customMenu,
                                    Option: customOption,
                                }}
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
