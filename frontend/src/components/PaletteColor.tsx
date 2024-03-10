import React from "react";
import styles from "../styles/palette.module.css";

export default function PalletteColor(props: { onClick: () => void; color: string }) {
    return <button className={styles.color} style={{ background: props.color }} onClick={props.onClick}></button>;
}
