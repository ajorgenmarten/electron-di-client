import { IpcRendererEvent } from "electron";

type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void;

interface IpcClientApi {
    on(channel: string, listener: IpcRendererListener): () => any;
    send(channel: string, ...args: any[]): void;
    invoke(channel: string, ...args: any[]): Promise<any>;
}


type UseIn = "request" | "response"

type Context = {
    Type: "invoke" | "send"
    Payload?: object
    Channel: string
}

type RequestInterceptor = {
    Pipe: (context: Context) => Context | Promise<Context>
    OnReject?: (error: any) => Context 
}

type ResponseInterceptor = {
    OnComplete: (value: any) => any | Promise<any>
    OnReject?: (error: any) => any
}


export class IpcClient {
    private requestInterceptors: RequestInterceptor[] = []
    private responseInterceptors: ResponseInterceptor[] = []

    constructor(private ipc: IpcClientApi) {}

    use(type: UseIn, interceptor: RequestInterceptor | ResponseInterceptor) {
        if (type === 'request') this.requestInterceptors.push(interceptor as RequestInterceptor)
        else this.responseInterceptors.push(interceptor as ResponseInterceptor)
    }

    private async runRequest(context: Context) {
        let value = context
        for(const interceptor of this.requestInterceptors) {
            try {
                value = await interceptor.Pipe(value)
            } catch (error) {
                if (interceptor.OnReject) value = interceptor.OnReject(error)
                else throw error
            }
        }
        return value
    }

    private async runResponse(value: any) {
        let response = value
        for(const interceptor of this.responseInterceptors) {
            try {
                value = await interceptor.OnComplete(response)
            } catch (error) {
                if (interceptor.OnReject) value = interceptor.OnReject(error)
                else throw error
            }
        }
        return response
    }

    async invoke(channel: string, data?: object) {
        const context: Context = {
            Channel: channel,
            Type: 'invoke',
            Payload: data
        }

        try {
            const modifiedContext = await this.runRequest(context)

            const response = await this.ipc.invoke(modifiedContext.Channel, modifiedContext.Payload)

            return await this.runResponse(response)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async send(channel: string, data?: object) {
        const context: Context = {
            Channel: channel,
            Type: 'send',
            Payload: data
        }

        try {
            const modifiedContext = await this.runRequest(context)

            this.ipc.send(modifiedContext.Channel, modifiedContext.Payload)
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}