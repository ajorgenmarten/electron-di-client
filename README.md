# electron-di-react

Flujo de comunicación entre React y Electron, en conjunto con [`electron-di`](https://github.com/ajorgenmarten/electron-di), es una herramineta potente para facilitar la creación de aplicaciones de escritorio con React y Electron.

## Instalación

```bash
npm install electron-di-react
```

## Uso en dependecia de como estes usando electron esto seria un ejemplo con el empaquetado de [`electron-vite`](https://electron-vite.org/guide/#scaffolding-your-first-electron-vite-project)

```tsx
import { IPCProvider } from 'electron-di-react'

return (
    <IPCProvider ipcRenderer={window.electron.ipcRenderer}>
        <App />
    </IPCProvider>
)
```

## Ejemplo

```tsx
import { IPCProvider, useIPC } from 'electron-di-react'


const Component = () => {
    const [count, setCount] = useState(0)
    const { request } = useIPC()

    const increment = async () => {
        const response = await request('increment', { payload: count })
        setCount(response.payload)
    }

    return (
        <div>
            <h1>Count: {count}</h1>
            <button onClick={increment}>Increment</button>
        </div>
    )
}

export default function App() {
    return (
        <IPCProvider ipcRenderer={window.electron.ipcRenderer}>
            <Component />
        </IPCProvider>
    )
}
```

## API

### useIPC

Devuelve un objeto con dos propiedades:

- `ipc`: Un objeto `IpcRenderer` que puede ser utilizado para enviar y recibir mensajes entre procesos.
- `request`: Una función que permite enviar y recibir mensajes entre procesos.

### IPCProvider

Un componente que provee un contexto para el uso de `useIPC`.

#### Propiedades

- `ipcRenderer`: Un objeto `IpcRenderer` que se utilizará para enviar y recibir mensajes entre procesos.
- `children`: Un componente que se renderizará dentro del contexto.

### IPCRequest

Una interfaz que define los parámetros de una solicitud de IPC.

#### Propiedades

- `method`: Un string que indica el método de envío de la solicitud. Por defecto es "invoke".
- `headers`: Un objeto que contiene las cabeceras de la solicitud.
- `payload`: Un objeto que contiene el cuerpo de la solicitud.

### IPCResponse

Una interfaz que define los parámetros de una respuesta de IPC.

#### Propiedades

- `headers`: Un objeto que contiene las cabeceras de la respuesta.
- `payload`: Un objeto que contiene el cuerpo de la respuesta.