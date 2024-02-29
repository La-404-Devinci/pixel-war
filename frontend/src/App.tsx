// import { useState } from 'react'
import { SetStateAction, useEffect, useState } from 'react';
import './App.css'
import LoginComponent from './pages/login'
import { socket } from './socket';
import classementItem from '../../common/interfaces/classementItem.interface'
import Canvas from './components/Canvas'
import Palette from './components/Palette';
import Timer from './components/Timer';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [classement, setClassement] = useState<classementItem[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);


  const [selectedColor, setSelectedColor] = useState("white");

  const [zoom, setZoom] = useState(1);


  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onclassementUpdate(data: classementItem[]) {
      setClassement(data)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('classementUpdate', onclassementUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('classementUpdate', onclassementUpdate);
    };
  }, []);



  const handleColorSelect = (color: SetStateAction<string>) => {
    setSelectedColor(color);
    console.log('Couleur sélectionnée dans App.tsx:', color);
  };



  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Multiplicateur de zoom arbitraire
      const zoomFactor = 0.1;
      // Si la molette de la souris est déplacée vers le haut, zoom avant, sinon zoom arrière
      const newZoom = event.deltaY > 0 ? zoom - zoomFactor : zoom + zoomFactor;
      // Limiter le zoom à un minimum de 0.1 pour éviter les valeurs non valides
      setZoom(Math.max(0.1, newZoom));
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [zoom]);





  // affichage (render)
  return (
    <div>
      <div className='test-canvas'>
        <Canvas actualColor={selectedColor} zoom={zoom} />
        <Palette onColorClick={handleColorSelect} />
        <Timer />
      </div>

      {/* <div id="test-login">
        <LoginComponent />
      </div> */}
    </div>
  );
}

export default App
