import { useState } from 'react';
import styles from './App.module.css';
import ProfilComponent from './pages/profil';
// import LoginComponent from './pages/login';

interface AppProps {}

function App(props: AppProps) {

  const [userEmail, setUserEmail] = useState("")
  const [afficherProfil, setAfficherProfil] = useState(false);

  const handleLogin = (email:string) => {
    console.log(`Email: ${email}`);
    setUserEmail(email);
  }

  const handleAfficherProfil = () => {
    setAfficherProfil(!afficherProfil);
  }

  // affichage (render)
  return (
    <div className={styles.homepage}>
      <div id="test-login">
        {/* <LoginComponent onLogin={handleLogin} /> */}
      </div>
      {!afficherProfil && <button onClick={handleAfficherProfil} className={styles.btnProfil}><img src="/src/assets/user-large.svg" alt="icone-user-profil" /></button>}      
      {afficherProfil && <ProfilComponent userEmail={userEmail} onHideProfil={handleAfficherProfil} />}
    </div>
  );
}

export default App
