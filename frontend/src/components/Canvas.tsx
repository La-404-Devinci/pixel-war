import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import styles from '../App.module.css';

export default function Canvas(props: {actualColor: string, zoom: number}) {
    const canvasRef = useRef<HTMLCanvasElement>(null); // Référence pour le canvas
    const cursorRef = useRef<HTMLDivElement>(null); // Référence pour le curseur

    const [pixelSize, setPixelWidth] = useState(20);

    const zoom = props.zoom;

    useEffect(() => {
        // Accéder aux éléments DOM à travers les refs
        const cursor = cursorRef.current;
        if (cursor) {
            cursor.style.background = props.actualColor;
        }
    }, [props.actualColor]);

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
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.fillStyle = props.actualColor;

        const [pixelX, pixelY] = getCursorPosition(event);
        const x = pixelX * pixelSize;
        const y = pixelY * pixelSize;

        ctx.fillRect(x, y, pixelSize, pixelSize);
    }

    function handleMove(event: React.MouseEvent<HTMLCanvasElement>) {
        const [pixelX, pixelY] = getCursorPosition(event);
        const cursor = cursorRef.current;

        if (cursor) {
            cursor.style.left = pixelX * pixelSize + 'px';
            cursor.style.top = pixelY * pixelSize + 'px';
        }
    }

    return (
        <div className={styles.canvas} style={{transform: `scale(${zoom})`}}>
            <div
                ref={cursorRef}
                className={styles.cursor}
                style={{width: pixelSize, height: pixelSize}}
                onMouseDown={handleClick as React.MouseEventHandler<HTMLDivElement>}
            ></div>
            <canvas
                ref={canvasRef}
                className={styles.game}
                width={500}
                height={500}
                onMouseMove={handleMove}
                onMouseDown={handleClick}
            ></canvas>
        </div>
    );
}