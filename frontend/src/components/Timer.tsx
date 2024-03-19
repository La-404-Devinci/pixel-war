import { useEffect, useState } from "react";
import styles from "../styles/palette.module.css";

interface TimerComponentProps {
    time: number;
    setTime: React.Dispatch<React.SetStateAction<number>>;
}

const Timer: React.FC<TimerComponentProps> = ({ time, setTime }) => {
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 0) {
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [setTime]);

    return time > 0 && <div className={styles.timer}>{formatTime(time)}</div>;
};

export default Timer;
