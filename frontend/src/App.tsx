// import { useState } from 'react'
import { useEffect, useState } from 'react';
import './App.css'
import LoginComponent from './pages/login'
import { socket } from './socket';
import classementItem from '../../common/interfaces/classementItem.interface'

function App() {
  const [classement, setClassement] = useState<classementItem[]>([])
  const [isConnected, setIsConnected] = useState(socket.connected);

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

  // affichage (render)
  return (
    <div>
      <div id="test-login">
        <LoginComponent />
      </div>
    </div>
  );
}

export default App
