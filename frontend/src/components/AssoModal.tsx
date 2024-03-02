import React, { useEffect } from 'react'
import { useState } from 'react'
import styles from '../styles/assoModal.module.css'
import Select from 'react-select';
import { Input } from 'react-select/animated';
import { JSX } from 'react/jsx-runtime';



export default function AssoModal() {

  const [listAsso, setListAsso] = useState([
    { id: 'asso1', name: 'Asso john', image: 'https://media.istockphoto.com/id/1023347350/fr/photo/point-dinterrogation-3d-point-rouge-dinterrogation-demandant-signe-de-ponctuation-isol%C3%A9e.jpg?s=612x612&w=0&k=20&c=eVZrCH5I73a5W_2TZ0tlrWdK68UAoXZPaytoZyGoj90='},
    { id: 'asso2', name: 'Asso bob', image: 'https://media.istockphoto.com/id/1023347350/fr/photo/point-dinterrogation-3d-point-rouge-dinterrogation-demandant-signe-de-ponctuation-isol%C3%A9e.jpg?s=612x612&w=0&k=20&c=eVZrCH5I73a5W_2TZ0tlrWdK68UAoXZPaytoZyGoj90='},
    { id: 'asso3', name: 'Asso roger', image: 'https://media.istockphoto.com/id/1023347350/fr/photo/point-dinterrogation-3d-point-rouge-dinterrogation-demandant-signe-de-ponctuation-isol%C3%A9e.jpg?s=612x612&w=0&k=20&c=eVZrCH5I73a5W_2TZ0tlrWdK68UAoXZPaytoZyGoj90='},
    { id: 'asso4', name: 'Asso sebastien', image: 'https://media.istockphoto.com/id/1023347350/fr/photo/point-dinterrogation-3d-point-rouge-dinterrogation-demandant-signe-de-ponctuation-isol%C3%A9e.jpg?s=612x612&w=0&k=20&c=eVZrCH5I73a5W_2TZ0tlrWdK68UAoXZPaytoZyGoj90='},
    { id: 'asso5', name: 'Asso tom', image: 'https://media.istockphoto.com/id/1023347350/fr/photo/point-dinterrogation-3d-point-rouge-dinterrogation-demandant-signe-de-ponctuation-isol%C3%A9e.jpg?s=612x612&w=0&k=20&c=eVZrCH5I73a5W_2TZ0tlrWdK68UAoXZPaytoZyGoj90='},
  ]);


  const [selectedAsso, setSelectedAsso] = useState(null)

  const [displayAssoModal, setDisplayAssoModal] = useState(true)

  
  const handleSelectChange = (selectedOption: any) => {
    setSelectedAsso(selectedOption);
  };

  const handleHide = () => {
    setDisplayAssoModal(false);
  }


  return (
    <div>
      {displayAssoModal && (
      
        <div className={styles.modalAsso}>
          <h1>
            Une asso ?
          </h1>

          <p>
            Si vous faites partie d'une association, entrez la juste ici pour la représenter.
          </p>

          <Select className={styles.assoList} placeholder="Choisir une asso"
            components={{ Input }}
            options={listAsso.map((asso) => ({
              value: asso.id,
              label: asso.name,
              image: asso.image
            }))}
            onChange={handleSelectChange}
            value={selectedAsso}
          />
          {/* {selectedAsso && (
            <div>
              <p>Asso sélectionnée : {selectedAsso.label}</p>
              <img src={selectedAsso.image} alt="icone-asso" />
            </div>
          )} */}

          <button>C'est parti !</button>

          <a onClick={handleHide}>
            Je ne suis pas dans une asso
          </a>
        </div>
      )}
    </div>
  )
}