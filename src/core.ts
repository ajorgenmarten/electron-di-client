import { IpcRendererEvent } from "electron";

type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void;

interface IpcClientApi {
    on(channel: string, listener: IpcRendererListener): () => any;
    send(channel: string, ...args: any[]): void;
    invoke(channel: string, ...args: any[]): Promise<any>;
}

type Context = {
    Type: "invoke" | "send"
    Channel: string
}

type Interceptor<T extends "request" | "response"> = {
    Pipe?: T extends "request" 
        ? (context: Context, payload?: any) => any | Promise<any>
        : (context: Context, response?: any) => any | Promise<any>
    OnReject?: (err: any, context: Context) => any | Promise<any>
}

export class IpcClient {
    private requestInterceptors: Interceptor<"request">[] = []
    private responseInterceptors: Interceptor<"response">[] = []

    constructor(private ipc: IpcClientApi) {}

    use<T extends "request" | "response">(type: T, interceptor: Interceptor<T>) { 
        if (type === 'request') this.requestInterceptors.push(interceptor as Interceptor<"request">)
        else this.responseInterceptors.push(interceptor as Interceptor<"response">)
    }

    private async run(type: 'request' | 'response', context: Context, value: any) {
        const interceptors = type === 'request' ? this.requestInterceptors : this.responseInterceptors

        let result = value
        for(const interceptor of interceptors) {
            try {
                if(interceptor.Pipe) result = await interceptor.Pipe({...context}, result)
            } catch (error) {
                if(interceptor.OnReject) result = await interceptor.OnReject(error, {...context})
                else throw error
            }
        }
        return result
    }

    async invoke<T = any>(channel: string, data?: T) {
        const context: Context = { Channel: channel, Type: 'invoke' }
        const modifiedData = await this.run('request', context, data)
        return this.run('response', context, await this.ipc.invoke(channel, modifiedData))
    }

    async send<T = any>(channel: string, data?: T) {
        const context: Context = { Channel: channel, Type: 'send'}
        const modifiedData = await this.run('response', context, data)
        this.ipc.send(channel, modifiedData)
    }
}