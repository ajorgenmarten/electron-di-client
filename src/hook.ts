import { useState } from "react";
import { IPCRequest, IPCResponse, IPCRenderer } from "./types";

export function useIPCContextHook(ipcrenderer: IPCRenderer) {
    const [ipc, setIpc] = useState(ipcrenderer);

    if (typeof ipcrenderer === 'undefined') {
        throw new Error('electron-di-react: ipcrenderer is undefined');
    }

    const request = async <T = any>(channel: string, request: IPCRequest = {}) => {
        const method = request.method || "invoke";
        const headers = request.headers || {};
        const payload = typeof request.payload === 'undefined' ? {} : request.payload;
        let promise = null;
        if (method === "invoke")
            promise = ipc.invoke(channel, { headers, payload });
        if (method === "send")
            promise = ipc.send(channel, { headers, payload });
        return await promise as IPCResponse<T>;
    }

    return { ipc, request }
    
}