export { };

declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                send: (channel: string, ...args: any[]) => void;
                on: (channel: string, listener: (...args: any[]) => void) => void;
                removeListener: (channel: string, listener: (...args: any[]) => void) => void;
            };
        };
    }
}