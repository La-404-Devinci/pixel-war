import { useState } from 'react';
import styles from './App.module.css';
import ProfilComponent from './components/profil';
import LoginComponent from './components/login';

interface AppProps {}

function App(props: AppProps) {

  const [userEmail, setUserEmail] = useState("")
  // const [isValidEmail, setIsValidEmail] = useState(false);
  const [display, setdisplay] = useState(false);

  const handleLogin = (email:string) => {
    console.log(`Email: ${email}`);
    setUserEmail(email);
  }

  const handledisplayProfile = () => {
    setdisplay(!display);
    // modifier fonction pour savoir sur quel bouton on a cliqué pour pas display les deux en même temps
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

      {!display && <button onClick={handledisplayProfile} className={styles.btnProfil}><img src="/src/assets/user-large.svg" alt="icone-user-profil" /></button>}      
      {display && <ProfilComponent userEmail={userEmail} onHideProfil={handledisplayProfile} />}

    </div>
  );
}

export default App
