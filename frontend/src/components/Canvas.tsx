import { useEffect, useState, useRef } from "react";
import styles from "../styles/canvas.module.css";
import { socket } from "../socket";
import API from "../utils/api";
import isMobile from "../utils/isMobile";
import Tooltip, { TooltipSettings } from "./Tooltip";
import { usePinch } from "@use-gesture/react";

interface CanvasProps {
    actualColor: number;
    readOnly: boolean;
    onPlacePixel: (x: number, y: number) => void;
    palette: string[];
}

const Canvas = ({ actualColor, readOnly, onPlacePixel, palette }: CanvasProps) => {
    const pixelSize = 20;

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    const zoom = useRef(1);

    const [tooltip, setTooltip] = useState<TooltipSettings | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        let canvasX = 0;
        let canvasY = 0;
        let lastX = 0;
        let lastY = 0;
        let startDragX = 0;
        let startDragY = 0;

        const getCursorPosition = (x: number, y: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return [0, 0];

            const relativeX = x - canvas.getBoundingClientRect().left;
            const relativeY = y - canvas.getBoundingClientRect().top;

            const zoomX = relativeX / zoom.current;
            const zoomY = relativeY / zoom.current;

            const pixelX = Math.floor(zoomX / pixelSize);
            const pixelY = Math.floor(zoomY / pixelSize);

            return [pixelX, pixelY];
        };

        const handleMouseDown = (event: MouseEvent) => {
            if (event.button !== 0) return;
            handleDown(event.clientX, event.clientY);
        };

        const handleTouchStart = (event: TouchEvent) => {
            handleDown(event.touches[0].clientX, event.touches[0].clientY);
        };

        const handleDown = (x: number, y: number) => {
            lastX = x;
            lastY = y;
            startDragX = x;
            startDragY = y;
        };

        const handleMouseMove = (event: MouseEvent) => {
            handleMove(event.clientX, event.clientY);
        };

        const handleTouchMove = (event: TouchEvent) => {
            handleMove(event.touches[0].clientX, event.touches[0].clientY);
        };

        const handleMove = (x: number, y: number) => {
            if (!isMobile.any()) {
                const [pixelX, pixelY] = getCursorPosition(x, y);
                const cursor = cursorRef.current;

                if (cursor) {
                    cursor.style.left = pixelX * pixelSize + "px";
                    cursor.style.top = pixelY * pixelSize + "px";
                }
            }

            if (startDragX === 0 && startDragY === 0) return;

            // déplacement de l'utilisateur
            const deltaX = x - lastX;
            const deltaY = y - lastY;

            canvasX += deltaX;
            canvasY += deltaY;
            lastX = x;
            lastY = y;

            // déplacement du canvas
            container.style.left = `${canvasX}px`;
            container.style.top = `${canvasY}px`;
        };

        const handleMouseUp = (event: MouseEvent) => {
            if (event.button === 0) handleUp(event.target !== canvasRef.current && event.target !== cursorRef.current);
        };

        const handleTouchUp = (event: TouchEvent) => {
            if (event.touches.length !== 0) return;
            handleUp(event.target !== canvasRef.current && event.target !== cursorRef.current);
        };

        const handleUp = (isObstrued: boolean) => {
            if (lastX === 0 && lastY === 0) return;

            // consider drag if the user moved more than 7 pixels
            const drag = Math.abs(startDragX - lastX) > 7 || Math.abs(startDragY - lastY) > 7;

            startDragX = 0;
            startDragY = 0;

            if (!drag && !readOnly && !isObstrued) {
                const [pixelX, pixelY] = getCursorPosition(lastX, lastY);
                const cursor = cursorRef.current;

                if (cursor) {
                    // Place pixel if the cursor is at the same position
                    if (cursor.style.left === pixelX * pixelSize + "px" && cursor.style.top === pixelY * pixelSize + "px") {
                        onPlacePixel(pixelX, pixelY);
                        return;
                    }

                    // Otherwise, move the cursor to the pixel position (mobile placement confirmation)
                    cursor.style.left = pixelX * pixelSize + "px";
                    cursor.style.top = pixelY * pixelSize + "px";
                }
            }
        };

        const handleWheel = (event: WheelEvent) => {
            // Multiplicateur de zoom arbitraire
            const zoomFactor = 0.1;
            // Si la molette de la souris est déplacée vers le haut, zoom avant, sinon zoom arrière
            zoom.current = event.deltaY < 0 ? zoom.current + zoomFactor : zoom.current - zoomFactor;

            if (zoom.current < 0.1) zoom.current = 0.1;
            container.style.transform = `scale(${zoom.current})`;
        };

        const handleSpecial = (event: MouseEvent) => {
            event.preventDefault();

            const [x, y] = [event.clientX, event.clientY];
            const [pixelX, pixelY] = getCursorPosition(x, y);

            API.GET(`/canvas/history?x=${pixelX}&y=${pixelY}`).then((res) => {
                if (res.length === 0) return;
                setTooltip({
                    title: `History (${res.x}, ${res.y})`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value: res.history.map((item: any) => {
                        return {
                            name: item.devinciEmail.split("@")[0],
                            time: new Date(item.time * 1).toLocaleString("fr-FR").slice(0, -3), // DD/MM HH:MM:SS
                            color: `rgb(${item.action.color.join(",")})`,
                        };
                    }),
                    x: x,
                    y: y,
                });
            });
        };

        // Desktop events
        if (!isMobile.any()) {
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mousedown", handleMouseDown);
        }

        // Mobile events
        else {
            window.addEventListener("touchend", handleTouchUp);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchstart", handleTouchStart);
        }

        window.addEventListener("contextmenu", handleSpecial);
        window.addEventListener("wheel", handleWheel);

        return () => {
            // Desktop events
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);

            // Mobile events
            window.removeEventListener("touchend", handleTouchUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchstart", handleTouchStart);

            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("contextmenu", handleSpecial);
        };
    }, [onPlacePixel, readOnly]);

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
            zoom.current = minScreenSize / maxCanvasSize;
            containerRef.current!.style.transform = `scale(${zoom.current * 0.9})`;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.imageSmoothingEnabled = false;

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const colorR = res.pixels.data[(y * 1024 + x) * 3];
                    const colorG = res.pixels.data[(y * 1024 + x) * 3 + 1];
                    const colorB = res.pixels.data[(y * 1024 + x) * 3 + 2];

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
            cursor.style.setProperty("--color", palette[actualColor]);
        }
    }, [actualColor, palette]);

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
    }, [palette, pixelSize]);

    usePinch(
        ({ offset: [d] }) => {
            zoom.current += d;
            if (zoom.current < 0.1) zoom.current = 0.1;
            containerRef.current!.style.transform = `scale(${zoom.current})`;
        },
        {
            target: containerRef,
            eventOptions: { passive: false },
        },
    );

    return (
        <>
            {tooltip && <Tooltip data={tooltip} setData={setTooltip} />}
            <div className={styles.canvas} ref={containerRef}>
                {!readOnly && <div ref={cursorRef} className={styles.cursor} style={{ width: pixelSize, height: pixelSize }}></div>}
                <canvas ref={canvasRef} className={styles.game} width={500} height={500}></canvas>
            </div>
        </>
    );
};

export default Canvas;
