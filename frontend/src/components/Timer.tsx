import { useEffect, useState } from "react";
import styles from "../styles/palette.module.css";

interface TimerComponentProps {
    time: number;
}

const Timer: React.FC<TimerComponentProps> = ({ time }) => {
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const [now, setNow] = useState(new Date().getTime() / 1000);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date().getTime() / 1000);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return time > now && <div className={styles.timer}>{formatTime(time - now)}</div>;
};

export default Timer;
