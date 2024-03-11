import PaletteColor from "./PaletteColor";
import styles from "../styles/palette.module.css";

export default function Palette({
    onColorClick,
    colors = [],
    selectedColor,
    isActive,
}: {
    onColorClick(color: number): unknown;
    colors?: string[];
    selectedColor: number;
    isActive: boolean;
}) {
    // useState (array of colors | null)

    // useEffect (fetch colors from backend)

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
                opacity: isActive ? 1 : 0.7,
                pointerEvents: isActive ? "auto" : "none",
            }}
        >
            {handleRenderColors()}
        </div>
    );
}
