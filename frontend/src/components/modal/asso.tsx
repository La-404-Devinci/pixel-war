// import React, { useEffect } from 'react'
import { useEffect, useState } from "react";
import styles from "../../styles/modal/asso.module.css";
import AsyncSelect from "react-select/async";
import { components } from "react-select";

import ModalComponent from "./Modal";
import API from "../../utils/api";

type Option = {
    image: string;
    label: string;
    value: string;
};

export default function AssoModal() {
    const [selectedAsso, setSelectedAsso] = useState<string | null>(null);
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        if (selectedAsso) {
            console.log(selectedAsso);
        }
    }, [selectedAsso]);

    useEffect(() => {
        API.GET("/asso")
            .then((res) => {
                console.log(res);
                if (res) {
                    setSelectedAsso(res);

                    API.GET("/assos")
                        .then((res) => {
                            console.log(res);
                            setOptions(res);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    if (options.length === 0) {
        return null;
    }

    const handleAssoChange = () => {
        API.POST("/asso", { association: selectedAsso })
            .then(() => {
                console.log("Association updated");
                setSelectedAsso(null);
                setOptions([]);
            })
            .catch((err) => {
                console.error(err);
            });
    };

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
                    loadOptions={(inputValue, callback) => {
                        console.log(inputValue);
                        if (!inputValue) return callback(options);
                        callback(options.filter((i: Option) => i.label.toLowerCase().includes(inputValue.toLowerCase())));
                    }}
                    defaultOptions={true}
                    openMenuOnClick
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
                <button className={styles.chooseAssoBtn} onClick={handleAssoChange} disabled={!selectedAsso}>
                    C'est parti !
                </button>
            </ModalComponent>
        </>
    );
}
