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

        socket.on('classementUpdate', onclassementUpdate);
    
        return () => {
          socket.off('classementUpdate', onclassementUpdate);
        };
    }, []);

    const handleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const img = isExpanded ? "/src/assets/angle-up.svg" : "/src/assets/angle-down.svg"

    return (
        <div className={styles.leaderboard}>
            <div className={styles.header}>
                <button onClick={handleExpand} className={styles.btnExpand}><img src={img} alt="arrow-down" />LeaderBoard</button>
            </div>
            {isExpanded && (
                <div className={styles.expanded}>
                    <p>1st - {classement} </p>
                    <p>2nd - {classement} </p>
                    <p>3rd - {classement}</p>
                </div>
            )}
        </div>
    )
}

export default LeaderboardComponent