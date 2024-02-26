import React,{ useEffect, useState, useRef } from 'react';
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

  const [displayProfile, setDisplayProfile] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [ShowLogin, setShowLogin] = useState(false);
  const loginComponentRef = useRef<HTMLDivElement>(null);

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

  const handleShowLogin = () => {
    setShowLogin(!ShowLogin);
  }

  const handleLogin = (email: string) => {
    if (loginComponentRef.current) {
      setUserEmail(email);
    }
  }

  const handledisplayProfile = () => {
    setDisplayProfile(!displayProfile);
  }

  // affichage (render)
  return (
    <div className={styles.homepage}>
      <div id="test-login">
        <button onClick={handleShowLogin} className={styles.btnLogin}>Login to draw !</button>
        <div>
          {ShowLogin && <LoginComponent onLogin={handleLogin} />}
        </div>
      </div>

      {!displayProfile && <button onClick={handledisplayProfile} className={styles.btnProfil}><img src="/src/assets/user-large.svg" alt="icone-user-profil" /></button>}      
      {displayProfile && <ProfilComponent userEmail={userEmail} onHideProfil={handledisplayProfile} />}

    </div>
  );
}

export default App
