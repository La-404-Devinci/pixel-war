import React, { useEffect, useState } from 'react'
import PaletteColor from './PaletteColor'
import styles from '../styles/palette.module.css'

export default function Palette({onColorClick}: {onColorClick(color: string): unknown}){
// useState (array of colors | null)

const [colors, setColors] = useState(["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"])


// useEffect (fetch colors from backend)

// useEffect(() => {
//   fetch('/colors')
//     .then(res => res.json())
//     .then(data => setColors(data))
// }, [])


function handleRenderColors() {

// conditional rendering (if colors === null, return loading)
  if (colors.length <= 0) {
    return <div>Loading...</div>
  }

// else map through colors and return a PaletteColor component for each color
  else {
    return colors.map(color => 
      <PaletteColor key={color} color={color} onClick={onColorClick} />
    )
  }
}


  return (
    <div className={styles.colorPalette}>
      {handleRenderColors()}
    </div>
  )
}
