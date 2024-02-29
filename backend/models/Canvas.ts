interface Canvas {
    pixels: Buffer;
    changes: number;
    width: number;
    height: number;
    cooldown: number;
}

export default Canvas;
