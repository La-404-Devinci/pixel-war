import {useState} from 'react'
import styles from '../styles/leaderboard.module.css'


const LeaderboardComponent = () => {

    const [isExpanded, setIsExpanded] = useState(false)

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
                    <p>1st - </p>
                    <p>2nd - </p>
                    <p>3rd -</p>
                </div>
            )}
        </div>
    )
}

export default LeaderboardComponent