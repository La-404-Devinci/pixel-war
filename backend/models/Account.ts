interface Account {
    devinciEmail: string;
    isMuted: boolean;
    isBanned: boolean;
    isAdmin: boolean;
    placedPixels: number;
    timeAlive: number;
    lastPixelTime: number;
    lastSentMessageTimes: number[];
    association: string;
}

export default Account;
