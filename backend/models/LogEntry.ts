interface LogEntry {
    devinciEmail: string;
    time: number;
    ip: string;
    action: PlaceAction | ChatAction;
}

interface PlaceAction {
    type: "place";
    x: number;
    y: number;
    color: number;
}

interface ChatAction {
    type: "chat";
    message: string;
}

export { PlaceAction, ChatAction };
export default LogEntry;
