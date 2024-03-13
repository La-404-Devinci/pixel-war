import { useState } from "react";
import styles from "../styles/login.module.css";
import API from "../utils/api";

interface LoginComponentProps {
    onClose: () => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        setMessage("");
    };

    const handleLoginClick = () => {
        if (email.endsWith("@edu.devinci.fr")) {
            setMessage("L'email a bien été envoyé, veuillez vérifier votre boîte de réception (et vos spams) pour le lien de connexion");

            try {
                API.POST("/auth/send-magic-link", { email });
                setIsEmailValid(true);
            } catch (error) {
                setMessage("Erreur lors de l'envoi de l'email");
                setIsEmailValid(false);
            }
        } else {
            setMessage("Email non valide");
            setIsEmailValid(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.login}>
                <div className={styles.loginTitle}>
                    <p>Login</p>
                </div>
                <label>Enter your devinci email</label>
                <input type="email" placeholder="email@edu.devinci.fr" value={email} onChange={handleEmailChange} />
                <button onClick={handleLoginClick} disabled={!!message}>
                    Send magic link
                </button>
                {message && <p className={isEmailValid ? styles.validMessage : styles.invalidMessage}>{message}</p>}
            </div>
        </div>
    );
};

export default LoginComponent;
