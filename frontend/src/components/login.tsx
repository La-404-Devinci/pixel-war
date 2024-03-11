import { useState } from "react";
import styles from "../styles/login.module.css";

interface LoginComponentProps {
    onLogin: (email: string) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin }) => {
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
            onLogin(email);
            setMessage("Email valide, envoi du lien...");
            setIsEmailValid(true);
        } else {
            setMessage("Email non valide");
            setIsEmailValid(false);
        }
    };

    return (
        <div className={styles.login}>
            <div className={styles.loginTitle}>
                <p>Login</p>
            </div>
            <label>Entrez votre email Devinci</label>
            <input
                type='email'
                placeholder='email@edu.devinci.fr'
                value={email}
                onChange={handleEmailChange}
            />
            <button
                onClick={handleLoginClick}
                disabled={!!message}
            >
                Envoyez le lien de connexion
            </button>
            {message && (
                <p
                    className={
                        isEmailValid
                            ? styles.validMessage
                            : styles.invalidMessage
                    }
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoginComponent;
