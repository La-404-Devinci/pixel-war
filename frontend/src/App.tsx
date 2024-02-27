import { useEffect, useState } from 'react'
import styles from './App.module.css'
import LoginComponent from './components/login'
import ProfilComponent from './components/profil'
import ChatComponent from './components/chat'
import { socket } from './socket'
import classementItem from '../../common/interfaces/classementItem.interface'

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [classement, setClassement] = useState<classementItem[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [userEmail, setUserEmail] = useState("");
  const [displayBtnLogin, setDisplayBtnLogin] = useState(true);
  const [displayComponent, setDisplayComponent] = useState("none");


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


  const handleLogin = (email: string) => {
    setUserEmail(email);
    setDisplayBtnLogin(false);
  }

  const handleDisplayComponent = (componentName: string) => {
    if (displayComponent === componentName) {
      setDisplayComponent("none");
    } else {
      setDisplayComponent(componentName);
    }  
  }

  // affichage (render)
  return (
    <div className={styles.homepage}>
      <div className={styles.containerTop}>
        <button onClick={() => handleDisplayComponent("chat")} className={styles.btnChat}><img src="/src/assets/message.svg" alt="" /></button>
        {displayComponent !== "chat" && <button onClick={() => handleDisplayComponent("profil")} className={styles.btnProfil}><img src="/src/assets/user-large.svg" alt="icone-user-profil" /></button>}      
      </div>

      {displayBtnLogin && <button onClick={() => handleDisplayComponent("login")} className={styles.btnLogin}>Login to draw !</button>}
      
      {displayComponent === "login" && <LoginComponent onLogin={handleLogin} />}
      {displayComponent === "profil" && <ProfilComponent userEmail={userEmail} onHideProfil={() => handleDisplayComponent("none")} />}
      {displayComponent === "chat" && <ChatComponent />}
    </div>
  );
}

export default App
