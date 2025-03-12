import { IPCContext } from './context'
import { useIPCContextHook } from './hook'
import { IPCRenderer } from './types'

export function IPCProvider(props: IPCProviderProps) {
    const ipcHook = useIPCContextHook(props.ipcRenderer)
    return <IPCContext.Provider value={ipcHook}>{props.children}</IPCContext.Provider>
}

interface IPCProviderProps {
    children?: React.ReactNode
    ipcRenderer: IPCRenderer
}