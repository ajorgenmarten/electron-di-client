import { createContext, useContext } from 'react'
import { useIPCContextHook } from './hook'
import { IPCRenderer, IpcRendererListener, IPCRequest, IPCResponse } from './types'

const defaultIpc = {
    invoke: async (_channel:string, ...args: any[]) => { },
    send: (_channel:string, ...args: any[]) => { },
    on: (_channel:string, _listener: IpcRendererListener) => { }
} as IPCRenderer

export const IPCContext = createContext<ReturnType<typeof useIPCContextHook>>({
    ipc: defaultIpc,
    request: async (_channel:string, _request?: IPCRequest) => { return { headers: {} } as IPCResponse<any> }
})

export const useIPC = () => useContext(IPCContext)