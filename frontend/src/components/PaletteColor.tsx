import React from 'react'

export default function PalletteColor(props: {onClick(color: string): unknown;color: string}) {

  const handleClick = () => {
    props.onClick(props.color); // Passez la couleur à la fonction onClick fournie par le parent
  };

  return (
    <button className='color' style={{background: props.color}} onClick={handleClick}>
      
    </button>
  )
}
