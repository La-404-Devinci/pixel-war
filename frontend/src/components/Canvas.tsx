import React, { useEffect } from 'react'
import { useState } from 'react';

export default function Canvas(props: {actualColor: string, zoom: number}) {

    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(500);
    const [pixelSize, setPixelWidth] = useState(20);

    const zoom = props.zoom;

    // Cadrillage test
    useEffect(() => {
        const cursor = document.querySelector('.cursor') as HTMLElement;
        cursor.style.background = props.actualColor;
    //     const canvas = document.querySelector('.game') as HTMLCanvasElement;
    //     const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     ctx.beginPath();
    //     ctx.strokeStyle = "black";

    //     for (let i = 0; i < 500; i++) {
    //         ctx.moveTo(i*pixelSize, 0);
    //         ctx.lineTo(i*pixelSize, 500);
    //     }
    //     ctx.stroke();

    //     for (let i = 0; i < 500; i++) {
    //         ctx.moveTo(0, i*pixelSize);
    //         ctx.lineTo(500, i*pixelSize);
    //     }
    //     ctx.stroke();
    }, [props.actualColor]);


    function getCursorPosition(event: React.MouseEvent<HTMLElement>) {
        const canvas = document.querySelector('.game') as HTMLCanvasElement;

        const relativeX = event.clientX - canvas.getBoundingClientRect().left;
        const relativeY = event.clientY - canvas.getBoundingClientRect().top;

        const zoomX = relativeX / zoom;
        const zoomY = relativeY / zoom;

        const pixelX = Math.floor(zoomX/pixelSize);
        const pixelY = Math.floor(zoomY/pixelSize);

        return [pixelX, pixelY];
    }


    function handleClick(event: React.MouseEvent<HTMLElement>) {
        const canvas = document.querySelector('.game') as HTMLCanvasElement;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.fillStyle = props.actualColor;

        const [pixelX, pixelY] = getCursorPosition(event);
        const x = pixelX * pixelSize;
        const y = pixelY * pixelSize;

        ctx.fillRect(x, y, pixelSize, pixelSize);
    }





    function handleMouve(event: React.MouseEvent<HTMLCanvasElement>) {
        const [pixelX, pixelY] = getCursorPosition(event);
        const cursor = document.querySelector('.cursor') as HTMLElement;

        cursor.style.left = pixelX * pixelSize + 'px';
        cursor.style.top = pixelY * pixelSize + 'px';

    }




    
return (
    <div className='canvas' style={{transform: `scale(${zoom})`}}>
        <div className='cursor' style={{width: pixelSize, height: pixelSize}} onMouseDown={handleClick as React.MouseEventHandler<HTMLDivElement>}>
        </div>
        <canvas className='game' width={width} height={height} onMouseMove={handleMouve} onMouseDown={handleClick}>
        </canvas>
    </div>
)
}
