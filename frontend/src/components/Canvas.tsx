import React, { forwardRef, useEffect, useState, useRef } from "react";
import styles from "../styles/canvas.module.css";
import { socket } from "../socket";
import API from "../utils/api";

interface CanvasProps {
    actualColor: number;
    readOnly: boolean;
    onPlacePixel: (x: number, y: number) => void;
    palette: string[];
    stopClick: boolean;
}

const Canvas = forwardRef((props: CanvasProps, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null); // Référence pour le canvas
    const cursorRef = useRef<HTMLDivElement>(null); // Référence pour le curseur

    const [pixelSize, setPixelWidth] = useState(20);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            // Multiplicateur de zoom arbitraire
            const zoomFactor = 0.1;
            // Si la molette de la souris est déplacée vers le haut, zoom avant, sinon zoom arrière
            const newZoom = event.deltaY > 0 ? zoom - zoomFactor : zoom + zoomFactor;
            // Limiter le zoom à un minimum de 0.1 pour éviter les valeurs non valides
            setZoom(Math.max(0.1, newZoom));
        };

        window.addEventListener("wheel", handleWheel);

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, [zoom]);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Load canvas image
        API.GET("/canvas/image").then((res) => {
            if (!canvasRef.current) return;
            const canvas = canvasRef.current;

            const height = res.height;
            const width = res.width;

            if (res.pixels.type !== "Buffer") {
                console.error("Invalid pixel buffer");
                return;
            }

            canvas.width = width * pixelSize;
            canvas.height = height * pixelSize;

            const parent = canvas.parentElement;
            if (parent) {
                parent.style.minWidth = width * pixelSize + "px";
                parent.style.minHeight = height * pixelSize + "px";
            }

            // Get zoom
            const minScreenSize = Math.min(window.innerWidth, window.innerHeight);
            const maxCanvasSize = Math.max(width * pixelSize, height * pixelSize);
            const newZoom = minScreenSize / maxCanvasSize;
            setZoom(newZoom * 0.9);

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const colorR = res.pixels[y * 1024 + x];
                    const colorG = res.pixels[y * 1024 + x + 1];
                    const colorB = res.pixels[y * 1024 + x + 2];

                    const canvas = canvasRef.current;
                    if (!canvas) return;

                    const ctx = canvas.getContext("2d");
                    if (!ctx) return;

                    ctx.beginPath();
                    ctx.fillStyle = `rgb(${colorR},${colorG},${colorB})`;
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        });
    }, [pixelSize]);

    useEffect(() => {
        // Accéder aux éléments DOM à travers les refs
        const cursor = cursorRef.current;
        if (cursor) {
            cursor.style.setProperty("--color", props.palette[props.actualColor]);
        }
    }, [props.actualColor, props.palette]);

    useEffect(() => {
        socket.on("canvas-pixel-update", (x: number, y: number, color: number[]) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.beginPath();
            ctx.fillStyle = "rgb(" + color.join(",") + ")";

            const xCoord = x * pixelSize;
            const yCoord = y * pixelSize;

            ctx.fillRect(xCoord, yCoord, pixelSize, pixelSize);
        });

        return () => {
            socket.off("canvas-pixel-update");
        };
    }, [props.palette, pixelSize]);

    function getCursorPosition(event: React.MouseEvent<HTMLElement>) {
        const canvas = canvasRef.current;
        if (!canvas) return [0, 0];

        const relativeX = event.clientX - canvas.getBoundingClientRect().left;
        const relativeY = event.clientY - canvas.getBoundingClientRect().top;

        const zoomX = relativeX / zoom;
        const zoomY = relativeY / zoom;

        const pixelX = Math.floor(zoomX / pixelSize);
        const pixelY = Math.floor(zoomY / pixelSize);

        return [pixelX, pixelY];
    }

    function handleClick(event: React.MouseEvent<HTMLElement>) {
        if (!props.readOnly) return;
        if (props.stopClick) return;

        const [pixelX, pixelY] = getCursorPosition(event);
        props.onPlacePixel(pixelX, pixelY);
    }

    function handleMove(event: React.MouseEvent<HTMLCanvasElement>) {
        const [pixelX, pixelY] = getCursorPosition(event);
        const cursor = cursorRef.current;

        if (cursor) {
            cursor.style.left = pixelX * pixelSize + "px";
            cursor.style.top = pixelY * pixelSize + "px";
        }
    }

    return (
        <div className={styles.canvas} style={{ transform: `scale(${zoom})` }} ref={ref as React.RefObject<HTMLDivElement> | null}>
            {!props.readOnly && (
                <div
                    ref={cursorRef}
                    className={styles.cursor}
                    style={{ width: pixelSize, height: pixelSize }}
                    onMouseDown={handleClick as React.MouseEventHandler<HTMLDivElement>}
                ></div>
            )}
            <canvas
                ref={canvasRef}
                className={styles.game}
                width={500}
                height={500}
                onMouseMove={!props.readOnly ? handleMove : undefined}
                onMouseDown={!props.readOnly ? handleClick : undefined}
            ></canvas>
        </div>
    );
});

export default Canvas;
