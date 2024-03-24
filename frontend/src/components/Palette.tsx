import PaletteColor from "./PaletteColor";
import styles from "../styles/palette.module.css";
import { useEffect, useState } from "react";

export default function Palette({
    onColorClick,
    colors = [],
    selectedColor,
    time,
}: {
    onColorClick(color: number): unknown;
    colors?: string[];
    selectedColor: number;
    time: number;
}) {
    const [now, setNow] = useState(new Date().getTime() / 1000);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date().getTime() / 1000);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    function handleRenderColors() {
        // conditional rendering (if colors === null, return loading)
        if (colors.length <= 0) {
            return <div>Loading...</div>;
        }

        // else map through colors and return a PaletteColor component for each color
        else {
            return colors.map((color, index) => (
                <PaletteColor key={color} color={color} onClick={() => onColorClick(index)} selected={index === selectedColor} />
            ));
        }
    }

    return (
        <div
            className={styles.colorPalette}
            style={{
                opacity: time <= now ? 1 : 0.7,
                pointerEvents: time <= now ? "auto" : "none",
            }}
        >
            {handleRenderColors()}
        </div>
    );
}
