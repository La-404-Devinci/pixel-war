import { useEffect, useState } from 'react';
import styles from './App.module.css'
import LoginComponent from './components/login'
import ProfilComponent from './components/profil'
import { socket } from './socket';
import classementItem from '../../common/interfaces/classementItem.interface'
import AssoModal from './components/AssoModal';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [classement, setClassement] = useState<classementItem[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [displayProfile, setDisplayProfile] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [displayLogin, setDisplayLogin] = useState(false);

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

  const handledisplayLogin = () => {
    setDisplayLogin(!displayLogin);
  }

  const handleLogin = (email: string) => {
    setUserEmail(email);
  }

  const handledisplayProfile = () => {
    setDisplayProfile(!displayProfile);
  }

  // affichage (render)
  return (
    <div className={styles.homepage}>
      <div className={styles.modalAssoContener}>
        <AssoModal />
      </div>
      <div>
        <button onClick={handledisplayLogin} className={styles.btnLogin}>Login to draw !</button>
        <div>
          {displayLogin && <LoginComponent onLogin={handleLogin} />}
        </div>
      </div>

      {!displayProfile && <button onClick={handledisplayProfile} className={styles.btnProfil}><img src="/src/assets/user-large.svg" alt="icone-user-profil" /></button>}      
      {displayProfile && <ProfilComponent userEmail={userEmail} onHideProfil={handledisplayProfile} />}

    </div>
  );
}

export default App
