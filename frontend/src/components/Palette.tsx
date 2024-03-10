import PaletteColor from "./PaletteColor";
import styles from "../styles/palette.module.css";

export default function Palette({ onColorClick, colors = [] }: { onColorClick(color: number): unknown; colors?: string[] }) {
    // useState (array of colors | null)

    // useEffect (fetch colors from backend)

    function handleRenderColors() {
        // conditional rendering (if colors === null, return loading)
        if (colors.length <= 0) {
            return <div>Loading...</div>;
        }

        // else map through colors and return a PaletteColor component for each color
        else {
            return colors.map((color, index) => <PaletteColor key={color} color={color} onClick={() => onColorClick(index)} />);
        }
    }

    return <div className={styles.colorPalette}>{handleRenderColors()}</div>;
}
