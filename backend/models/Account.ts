interface Account {
    id: number;
    devinciEmail: string;
    isMuted: boolean;
    isBanned: boolean;
    isAdmin: boolean;
    placedPixels: number;
    timeAlive: number | null;
    lastPixelTime: Date | null;
    lastSentMessageTimes: number[];
    association: string | null;
}

export default Account;
