import { createContext, useContext } from 'react'
import { useIPCContextHook } from './hook'
import { IPCRequest, IPCResponse } from './types'

export const IPCContext = createContext<ReturnType<typeof useIPCContextHook>>({
    ipc: Electron.ipcRenderer,
    request: async (_channel:string, _request?: IPCRequest) => { return { headers: {} } as IPCResponse<any> }
})

export const useIPC = () => useContext(IPCContext)