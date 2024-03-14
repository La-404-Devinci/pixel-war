import { useState, useEffect } from "react";
import styles from "../styles/modal/leaderboard.module.css";
import { socket } from "../socket";
import classementItem from "../../../common/interfaces/classementItem.interface";

const LeaderboardComponent = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [classement, setClassement] = useState<classementItem[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        function onclassementUpdate(data: classementItem[]) {
            setClassement(data);
        }

        socket.on("classement-update", onclassementUpdate);

        return () => {
            socket.off("classement-update", onclassementUpdate);
        };
    }, []);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.leaderboard}>
                <button onClick={handleExpand} className={styles.btnExpand}>
                    <img src={isExpanded ? "/src/assets/angle-up.svg" : "/src/assets/angle-down.svg"} alt="arrow-down" />
                    Classement
                </button>
            {isExpanded && (
                <div className={styles.expanded}>
                    {classement.length === 0 && <p>Le classement est vide</p>}

                    {classement.slice(0, 5).map((item, index) => (
                        <p key={index}>
                            <b>
                                {index + 1}
                                {index === 0 ? "er" : "ème"}
                            </b>{" "}
                            - {item.devinciEmail.split("@")[0]} ({item.placedPixels})
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaderboardComponent;
