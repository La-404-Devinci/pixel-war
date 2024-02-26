// import { useState } from 'react'
import { useEffect, useState } from 'react';
import styles from './App.module.css'
import LoginComponent from './components/login'
import ProfilComponent from './components/profil'
import { socket } from './socket';
import classementItem from '../../common/interfaces/classementItem.interface'

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [classement, setClassement] = useState<classementItem[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [display, setDisplay] = useState(false);
  const [userEmail, setUserEmail] = useState("");

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

  const handleShow = () => {
    const loginComponent = document.getElementById('loginComponent');
    if (loginComponent) {
      loginComponent.style.display = 'block';
    }
  }

  const handleLogin = (email: string) => {
    const loginComponent = document.getElementById('loginComponent');
    if (loginComponent) {
      loginComponent.style.display = 'none';
      setUserEmail(email);
    }
    console.log(`Email valide: ${email}`);
  }

  const handledisplayProfile = () => {
    setDisplay(!display);
  }

  // affichage (render)
  return (
    <div className={styles.homepage}>
      <div id="test-login">
        <button onClick={handleShow} className={styles.btnLogin}>Login to draw !</button>
        <div id="loginComponent" className={styles.loginComponent}>
          <LoginComponent onLogin={handleLogin}/>
        </div>
      </div>

      {!display && <button onClick={handledisplayProfile} className={styles.btnProfil}><img src="/src/assets/user-large.svg" alt="icone-user-profil" /></button>}      
      {display && <ProfilComponent userEmail={userEmail} onHideProfil={handledisplayProfile} />}

    </div>
  );
}

export default App
