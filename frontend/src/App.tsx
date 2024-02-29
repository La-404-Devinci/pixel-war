import { useEffect, useState } from 'react'
import styles from './App.module.css'
import LoginComponent from './components/login'
import ProfilComponent from './components/profil'
import LeaderboardComponent from './components/leaderboard'
import { socket } from './socket';
import ChatComponent from './components/chat'
import isMobile from './utiles/isMobile'
import classementItem from '../../common/interfaces/classementItem.interface'

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [classement, setClassement] = useState<classementItem[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [userEmail, setUserEmail] = useState("");
  const [displayBtnLogin, setDisplayBtnLogin] = useState(true);
  const [displayComponent, setDisplayComponent] = useState("none");
  const [isMobileView, setIsMobileView] = useState(isMobile.any())


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

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile.any())
    };

    window.addEventListener('resize', handleResize)

    return () => {
        window.removeEventListener('resize', handleResize)
    };
  }, [])


  const handleLogin = (email: string) => {
    setUserEmail(email.split('@')[0]);
    setDisplayBtnLogin(false);
  }

  const handleDisplayComponent = (componentName: string) => {
    if (isMobileView == true) {
      if (displayComponent === componentName) {
        setDisplayComponent("none");
      } else {
        setDisplayComponent(componentName);
      }  
    }  else {
      if (displayComponent === componentName) {
        setDisplayComponent("none");
      } else {
        setDisplayComponent(componentName);
      }  
    } 
  }


  // affichage (render)
  return (
    <div className={styles.homepage}>
      <div className={styles.containerTop}>
        {isMobile.any() && <button onClick={() => handleDisplayComponent("chat")} className={styles.btnChat}><img src="/src/assets/message.svg" alt="icone-chat" /></button>}
        {displayComponent !== "profil" && <button onClick={() => handleDisplayComponent("profil")} className={styles.btnProfil}><img src="/src/assets/user-large.svg" alt="icone-user-profil" /></button>}      
      </div>
      
      <LeaderboardComponent />
      
      {displayBtnLogin && <button onClick={() => handleDisplayComponent("login")} className={styles.btnLogin}>Login to draw !</button>}
      
      {displayComponent === "login" && <LoginComponent onLogin={handleLogin} />}
      {displayComponent === "profil" && <ProfilComponent userEmail={userEmail} onHideProfil={() => handleDisplayComponent("none")} />}
      {displayComponent === "chat" && <ChatComponent />}
      {!isMobile.any() && <ChatComponent userEmail={userEmail} />}
    </div>
  );
}

export default App
