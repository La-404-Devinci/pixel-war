// import React, { useEffect } from 'react'
import { useEffect, useState } from "react";
import styles from "../styles/assoModal.module.css";
import AsyncSelect from "react-select/async";
import { components } from "react-select";

type Option = {
    image: string;
    label: string;
    value: string;
};

export default function AssoModal() {
    const [displayAssoModal, setDisplayAssoModal] = useState(true);
    const [selectedAsso, setSelectedAsso] = useState<string | null>(null);
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        // TODO: Fetch all associations
    }, []);

    const handleHide = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setDisplayAssoModal(false);
    };

    const filterAsso = (inputValue: string) => {
        return options.filter((i: Option) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
        callback(filterAsso(inputValue));
    };

    useEffect(() => {
        if (selectedAsso) {
            console.log(selectedAsso);
        }
    }, [selectedAsso]);

    return (
        <>
            {displayAssoModal && (
                <div className={styles.modalAssoContainer}>
                    <div className={styles.modalAsso}>
                        <h1>Une asso ?</h1>

                        <p>Si vous faites partie d'une association, entrez la juste ici pour la représenter.</p>

                        <AsyncSelect
                            placeholder="Choisissez votre association !"
                            loadOptions={loadOptions}
                            defaultOptions
                            cacheOptions
                            closeMenuOnSelect={false}
                            openMenuOnClick
                            defaultMenuIsOpen={true}
                            components={{
                                Option: (props) => (
                                    <components.Option {...props} className={styles.option}>
                                        <img src={props.data.image} alt={props.data.label} />
                                        <span>{props.data.label}</span>
                                    </components.Option>
                                ),
                            }}
                            noOptionsMessage={() => <p>Aucune association ne correspond à votre recherche.</p>}
                            blurInputOnSelect={true}
                            onChange={(e) => setSelectedAsso(e?.value || null)}
                            value={options.find((option) => option.value === selectedAsso)}
                        />

                        <button>C'est parti !</button>

                        <a onClick={handleHide}>Je ne suis pas dans une asso</a>
                    </div>
                </div>
            )}
        </>
    );
}
