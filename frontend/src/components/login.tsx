import { useState } from "react";
import styles from '../styles/login.module.css';

interface LoginComponentProps {
  onLogin: (email: string) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin }) => {
    
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [message, setMessage] = useState("");

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newEmail = event.target.value;
		setEmail(newEmail);
	
		if (newEmail.endsWith("@edu.devinci.fr")) {
			setIsValidEmail(true);
			setMessage(""); // Effacez le message d'erreur lorsque l'e-mail est valide
		} else {
			setIsValidEmail(false);
			setMessage("Email non valide"); // Affichez le message d'erreur lorsque l'e-mail n'est pas valide
		}
    };
  
    
    const handleLoginClick = () => {
      
		if (isValidEmail == true) {
			onLogin(email);
			setMessage("Email valide, envoi du lien...");
		} else {
			setMessage("Email non valide");
		}
    };
  
    return (
	<div className={styles.login}>
		<div className={styles.loginTitle}>
			<p>Login</p>
		</div>
		<label>Enter your devinci email</label>
		<input type="email" placeholder="email@edu.devinci.fr" value={email} onChange={handleEmailChange} />
		<button onClick={handleLoginClick} disabled={!isValidEmail}> 
			Send magic link		
		</button>
		<p>{message}</p>
	</div>
    );
  };
  
  export default LoginComponent;