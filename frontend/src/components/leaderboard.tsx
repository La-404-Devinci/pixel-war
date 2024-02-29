import {useState, useEffect} from 'react'
import styles from '../styles/leaderboard.module.css'
import {socket} from '../socket'
import classementItem from '../../common/interfaces/classementItem.interface'

const LeaderboardComponent = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [classement, setClassement] = useState<classementItem[]>([])
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        function onclassementUpdate(data: classementItem[]) {
          setClassement(data)
        }

        socket.on('classement-update', onclassementUpdate);
    
        return () => {
          socket.off('classement-update', onclassementUpdate);
        };
    }, []);

    const handleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const img = isExpanded ? "/src/assets/angle-up.svg" : "/src/assets/angle-down.svg"

    return (
        <div className={styles.leaderboard}>
            <div className={styles.header}>
                <button onClick={handleExpand} className={styles.btnExpand}><img src={img} alt="arrow-down" />Leaderboard</button>
            </div>
            {isExpanded && (
                <div className={styles.expanded}>
                    {classement.length === 0 && (<p>Le classement est vide</p>)}

                    {classement.slice(0, 5).map((item, index) => (
                        <p key={index}>
                            <b>{index + 1}{index === 0 ? "er" : "ème"}</b> - {item.devinciEmail.split("@")[0]} ({item.placedPixels})
                        </p>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LeaderboardComponent