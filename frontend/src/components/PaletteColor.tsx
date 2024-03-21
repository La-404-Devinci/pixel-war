import styles from "../styles/palette.module.css";

export default function PalletteColor(props: { onClick: () => void; color: string; selected: boolean }) {
    return (
        <button
            className={`${styles.color} ${props.selected ? styles.selected : ""}`}
            style={{ background: props.color }}
            onClick={props.onClick}
        ></button>
    );
}
