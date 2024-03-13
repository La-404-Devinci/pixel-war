import React, { forwardRef, useEffect, useState, useRef } from "react";
import styles from "../styles/canvas.module.css";
import { socket } from "../socket";
import API from "../utils/api";

interface CanvasProps {
    actualColor: number;
    readOnly: boolean;
    onPlacePixel: (x: number, y: number) => void;
    palette: string[];
}

const Canvas = (props: CanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    const [pixelSize, setPixelWidth] = useState(20);
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        let drag = false;
        let pinch: boolean | number = false;
        let canvasX = 0;
        let canvasY = 0;
        let moveX = 0;
        let moveY = 0;

        const handleMouseDown = (event: MouseEvent) => {
            if (event.button !== 0) return;
            handleDown(event.clientX, event.clientY);
        };

        const handleTouchStart = (event: TouchEvent) => {
            if (event.touches.length !== 1) return;
            handleDown(event.touches[0].clientX, event.touches[0].clientY);
        };

        const handleDown = (x: number, y: number) => {
            drag = true;
            setTimeout(() => {
                setIsDragging(true);
            }, 100);
            moveX = x;
            moveY = y;
        };

        const handleMouseMove = (event: MouseEvent) => {
            handleMove(event.clientX, event.clientY);
        };

        const handleTouchMove = (event: TouchEvent) => {
            handleMove(event.touches[0].clientX, event.touches[0].clientY);
        };

        const handleMove = (x: number, y: number) => {
            if (!drag) return;
            // déplacement de l'utilisateur
            const deltaX = x - moveX;
            const deltaY = y - moveY;

            canvasX += deltaX;
            canvasY += deltaY;
            moveX = x;
            moveY = y;

            // déplacement du canvas
            container.style.left = `${canvasX}px`;
            container.style.top = `${canvasY}px`;
        };

        const handleUp = () => {
            drag = false;
            setTimeout(() => {
                setIsDragging(false);
            }, 100);
        };

        const handleWheel = (event: WheelEvent) => {
            // Multiplicateur de zoom arbitraire
            const zoomFactor = 0.1;
            // Si la molette de la souris est déplacée vers le haut, zoom avant, sinon zoom arrière
            const newZoom = event.deltaY > 0 ? zoom - zoomFactor : zoom + zoomFactor;
            // Limiter le zoom à un minimum de 0.1 pour éviter les valeurs non valides
            setZoom(Math.max(0.1, newZoom));
        };

        // Desktop events
        window.addEventListener("mouseup", handleUp);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);

        // Mobile events
        window.addEventListener("touchend", (e) => {
            if (pinch) {
                e.preventDefault();
                pinch = false;
                return;
            }

            handleUp();
        });

        window.addEventListener("touchmove", (e) => {
            if (pinch) {
                e.preventDefault();
                const distance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                if (pinch === true) pinch = distance;
                const delta = distance - pinch;
                pinch = distance;

                const newZoom = zoom - delta * 0.01;
                setZoom(Math.max(0.1, newZoom));

                return;
            }

            handleTouchMove(e);
        });

        window.addEventListener("touchstart", (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
                pinch = true;
                return;
            }

            handleTouchStart(e);
        });

        window.addEventListener("wheel", handleWheel);

        return () => {
            // Desktop events
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleUp);
            window.removeEventListener("mousedown", handleMouseDown);

            // Mobile events
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleUp);
            window.removeEventListener("touchstart", handleTouchStart);
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
        if (isDragging) return;

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
        <div className={styles.canvas} style={{ transform: `scale(${zoom})` }} ref={containerRef}>
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
};

export default Canvas;
