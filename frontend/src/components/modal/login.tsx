import { useEffect, useState } from "react";
import styles from "../../styles/modal/login.module.css";
import API from "../../utils/api";
import ModalComponent from "./Modal";
import iconX from "../../assets/x.svg";

const LoginComponent = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        API.GET("/demo").then((res) => {
            if (res.demo === "🗿") {
                setIsDemo(true);
            }
        });
    }, []);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        setMessage("");
    };

    const handleLoginClick = () => {
        if (isDemo) {
            API.POST("/demo/login", { username: email }).then((res) => {
                window.location.href = res.link;
            });
        } else {
            API.POST("/auth/send-magic-link", { email })
                .then(() => {
                    setMessage("Email envoyé. Regardez vos mails.");
                    setIsEmailValid(true);
                })
                .catch(() => {
                    setMessage("Erreur lors de l'envoi de l'email");
                    setIsEmailValid(false);
                });
        }
    };

    return (
        <>
            <ModalComponent
                modalBtnContent="Connectez-vous pour dessiner !"
                modalBtnClassName={styles.btnLogin}
                titleContent="Connexion"
                titleClassName={styles.loginTitle}
                closeBtnContent={<img src={iconX} alt="Close button" />}
                optCloseBtnClassName={styles.close}
            >
                <div className={styles.login}>
                    <label>{isDemo ? "Entrez votre pseudo" : "Entrez votre email Devinci"}</label>
                    <input
                        type={isDemo ? "text" : "email"}
                        placeholder={isDemo ? "bino" : "email@edu.devinci.fr"}
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <button className={styles.btnSendMagicLink} onClick={handleLoginClick} disabled={!!message}>
                        {isDemo ? "Se connecter" : "Recevoir le lien de connexion"}
                    </button>
                    {message && <p className={isEmailValid ? styles.validMessage : styles.invalidMessage}>{message}</p>}
                </div>
            </ModalComponent>
        </>
    );
};

export default LoginComponent;
