import { useState } from "react";
import styles from "../../styles/login.module.css";
import API from "../../utils/api";
import ModalComponent from "./Modal";

const LoginComponent = () => {
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
            setMessage(
                "L'email a bien été envoyé, veuillez vérifier votre boîte de réception (et vos spams) pour le lien de connexion"
            );

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
        <>
            <ModalComponent
                modalBtnContent='Connectez-vous pour dessiner !'
                modalBtnClassName={styles.btnLogin}
                titleContent='Connexion'
                titleClassName={styles.loginTitle}
                closeBtnContent={
                    <img
                        src='/src/assets/x.svg'
                        alt='Close button'
                    />
                }
                optCloseBtnClassName={styles.close}
            >
                <div className={styles.login}>
                    <label>Entrez votre email Devinci</label>
                    <input
                        type='email'
                        placeholder='email@edu.devinci.fr'
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <button
                        className={styles.btnSendMagicLink}
                        onClick={handleLoginClick}
                        disabled={!!message}
                    >
                        Recevoir le lien de connexion
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
            </ModalComponent>
        </>
    );
};

export default LoginComponent;
