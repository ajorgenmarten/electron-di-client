import { IpcRendererEvent } from "electron";

export interface IPCRequest {
    /**
     * Por defecto el metodo utilizado es "invoke"
     */
    method?: "invoke" | "send";
    /**
     * Información adicional que se enviará
     */
    headers?: Record<string, string>;
    /**
     * Información adicional que se envia como cuerpo de la petición
     */
    payload?: any;
}

export interface IPCResponse<T> {
    headers: Record<string, string>
    payload?: T 
}

export type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void;
export interface IPCRenderer {
    /**
     * Listens to `channel`, when a new message arrives `listener` would be called with
     * `listener(event, args...)`.
     */
    on(channel: string, listener: IpcRendererListener): () => void;
    /**
     * Send an asynchronous message to the main process via `channel`, along with
     * arguments. Arguments will be serialized with the Structured Clone Algorithm,
     * just like `window.postMessage`, so prototype chains will not be included.
     * Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an
     * exception.
     *
     * **NOTE:** Sending non-standard JavaScript types such as DOM objects or special
     * Electron objects will throw an exception.
     *
     * Since the main process does not have support for DOM objects such as
     * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
     * Electron's IPC to the main process, as the main process would have no way to
     * decode them. Attempting to send such objects over IPC will result in an error.
     *
     * The main process handles it by listening for `channel` with the `ipcMain`
     * module.
     *
     * If you need to transfer a `MessagePort` to the main process, use
     * `ipcRenderer.postMessage`.
     *
     * If you want to receive a single response from the main process, like the result
     * of a method call, consider using `ipcRenderer.invoke`.
     */
    send(channel: string, ...args: any[]): void;
    /**
     * Resolves with the response from the main process.
     *
     * Send a message to the main process via `channel` and expect a result
     * asynchronously. Arguments will be serialized with the Structured Clone
     * Algorithm, just like `window.postMessage`, so prototype chains will not be
     * included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw
     * an exception.
     *
     * **NOTE:** Sending non-standard JavaScript types such as DOM objects or special
     * Electron objects will throw an exception.
     *
     * Since the main process does not have support for DOM objects such as
     * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
     * Electron's IPC to the main process, as the main process would have no way to
     * decode them. Attempting to send such objects over IPC will result in an error.
     *
     * The main process should listen for `channel` with `ipcMain.handle()`.
     *
     * For example:
     *
     * If you need to transfer a `MessagePort` to the main process, use
     * `ipcRenderer.postMessage`.
     *
     * If you do not need a response to the message, consider using `ipcRenderer.send`.
     */
    invoke(channel: string, ...args: any[]): Promise<any>;
}