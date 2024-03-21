import styles from "../styles/tooltip.module.css";

interface TooltipSettings {
    title: string;
    value: {
        name: string;
        time: string;
        color: string;
    }[];
    x: number;
    y: number;
}

interface TooltipProps {
    data: TooltipSettings;
    setData: (data: TooltipSettings | null) => void;
}

const Tooltip = ({ data, setData }: TooltipProps) => {
    return (
        <div className={styles.wrapper} onClick={() => setData(null)}>
            <div
                className={styles.container}
                style={{
                    left: data.x,
                    top: data.y,
                }}
            >
                <div className={styles.tooltip}>
                    <h6>{data.title}</h6>
                    <hr />
                    <div>
                        {data.value.map((item, index) => (
                            <div key={index} className={styles.item}>
                                <div style={{ backgroundColor: item.color }}></div>
                                <p>
                                    {item.time} <span>{item.name}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export type { TooltipSettings };
export default Tooltip;
