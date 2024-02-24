import { useState } from "react";
import styles from '../styles/login.module.css';

const LoginComponent = () => {
    
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
  
    
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newEmail = event.target.value;
      setEmail(newEmail);
  
      setIsValidEmail(newEmail.endsWith("@edu.devinci.fr"));
    };
  
    
    const handleLoginClick = () => {
      
      if (isValidEmail) {
        console.log(`Email valide: ${email}`);
      } else {
        console.log("Email non valide");
      }
    };
  
    return (
      <div id={styles.login}>
        <div id={styles['login-title']}>
          <p>Login</p>
        </div>
        <label>Enter your devinci email</label>
        <input type="email" placeholder="email@edu.devinci.fr" value={email} onChange={handleEmailChange} />
        <button onClick={handleLoginClick} disabled={!isValidEmail}>
          Send magic link
        </button>
      </div>
    );
  };
  
  export default LoginComponent;