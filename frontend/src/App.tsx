import { useState } from 'react';
import styles from './App.module.css';
import ProfilComponent from './components/profil';
import LoginComponent from './components/login';

interface AppProps {}

function App(props: AppProps) {

  const [userEmail, setUserEmail] = useState("")
  // const [isValidEmail, setIsValidEmail] = useState(false);
  const [afficher, setAfficher] = useState(false);

  const handleLogin = (email:string) => {
    console.log(`Email: ${email}`);
    setUserEmail(email);
  }

  const handleAfficherProfil = () => {
    setAfficher(!afficher);
    // modifier fonction pour savoir sur quel bouton on a cliqué pour pas afficher les deux en même temps
  }

  const handleShow = () => {
    const loginComponent = document.getElementById("loginComponent");
    if (loginComponent) {
      loginComponent.style.display = "block";
    }
  }

  // const isLoged = () => {
  //   // need liaison with backend
  // }

  // affichage (render)
  return (
    <div className={styles.homepage}>
      <div id="test-login">
        <button onClick={handleShow} className={styles.btnLogin}>Login to draw !</button>
        <div id="loginComponent" className={styles.loginComponent}>
          <LoginComponent onLogin={handleLogin}/>
        </div>
      </div>

      <div id="Log" className={styles.log}>
        {!afficher && <button onClick={handleAfficherProfil} className={styles.btnProfil}><img src="/src/assets/user-large.svg" alt="icone-user-profil" /></button>}      
        {afficher && <ProfilComponent userEmail={userEmail} onHideProfil={handleAfficherProfil} />}
      </div>

    </div>
  );
}

export default App
