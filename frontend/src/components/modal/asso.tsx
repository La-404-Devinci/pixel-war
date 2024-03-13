// import React, { useEffect } from 'react'
import { useEffect, useState } from "react";
import styles from "../../styles/modal/asso.module.css";
import AsyncSelect from "react-select/async";
import { components } from "react-select";

import ModalComponent from "./Modal";

type Option = {
    image: string;
    label: string;
    value: string;
};

export default function AssoModal() {
    const [selectedAsso, setSelectedAsso] = useState<string | null>(null);
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        // TODO: Fetch all associations
    }, []);

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
            <ModalComponent
                forceOpen={true}
                modalComponentClassName={styles.modalAsso}
                titleClassName="Une asso ?"
                titleContent="Une asso ?"
                textContent="Si vous faites partie d'une association, entrez la juste ici pour la représenter."
                closeBtnContent="Je n'ai pas d'association"
                linkAsCloseBtn={true}
            >
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
                        
                        {/* //TODO: Add Submit to back */}
                        <button className={styles.chooseAssoBtn}>C'est parti !</button>
            </ModalComponent>
        </>
    );
}
