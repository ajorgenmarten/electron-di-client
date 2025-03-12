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