import { useEffect, useState } from "react";
import styles from "../styles/palette.module.css";

interface TimerComponentProps {
    time: number;
}

const Timer: React.FC<TimerComponentProps> = ({ time }) => {
    const formatTime = (time: number) => {
        const timeSeconds = Math.floor(time / 1000);
        const minutes = Math.floor(timeSeconds / 60);
        const seconds = Math.floor(timeSeconds % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const [now, setNow] = useState(new Date().getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date().getTime());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return time > now && <div className={styles.timer}>{formatTime(time - now)}</div>;
};

export default Timer;
