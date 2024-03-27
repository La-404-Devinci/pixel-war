import { useEffect, useState } from "react";
import { socket } from "../socket";
import API from "../utils/api";
import styles from "../styles/toast.module.css";

export default function ToastComponent() {
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        socket.on("toast", (toast: string) => {
            setToast(toast);
        });

        API.GET("/toast").then((res) => {
            setToast(res.toast);
        });

        return () => {
            socket.off("toast");
        };
    }, []);

    return toast ? <div className={styles.toast} key={toast} dangerouslySetInnerHTML={{ __html: toast }}></div> : null;
}
