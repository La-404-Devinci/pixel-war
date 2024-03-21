import { useState, useEffect } from "react";
import styles from "../styles/modal/leaderboard.module.css";
import { socket } from "../socket";
import classementItem from "../../../common/interfaces/classementItem.interface";
import isMobile from "../utils/isMobile";

import iconAngleDown from "../assets/angle-down.svg";
import iconAngleUp from "../assets/angle-up.svg";
import iconPodium from "../assets/podium.svg";

const LeaderboardComponent = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [classement, setClassement] = useState<classementItem[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileView] = useState(isMobile.any());

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
        <>
            <div className={!isMobileView ? styles.leaderboard : ""}>
                {isMobileView ? (
                    <button onClick={handleExpand} className={styles.btnExpandMobile + " " + (isExpanded ? styles.active : "")}>
                        <img src={iconPodium} alt="icone-chat" />
                    </button>
                ) : (
                    <button onClick={handleExpand} className={styles.btnExpand}>
                        <img src={isExpanded ? iconAngleUp : iconAngleDown} alt="arrow-down" />
                        Classement
                    </button>
                )}
                {isExpanded && (
                    <div className={isMobileView ? styles.expandedMobile : styles.expanded}>
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
        </>
    );
};

export default LeaderboardComponent;
