import { IPCContext } from './context'
import { useIPCContextHook } from './hook'

export function IPCProvider(props: IPCProviderProps) {
    const ipcHook = useIPCContextHook(props.ipcRenderer)
    return <IPCContext.Provider value={ipcHook}>{props.children}</IPCContext.Provider>
}

interface IPCProviderProps {
    children?: React.ReactNode
    ipcRenderer: Electron.IpcRenderer
}