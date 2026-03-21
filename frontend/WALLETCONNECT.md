# WalletConnect Configuration

Este proyecto está configurado para usar WalletConnect con MetaMask.

## Setup

### 1. Obtener un Project ID

1. Visita [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia el `Project ID`

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=tu_project_id_aqui
```

### 3. Instalar dependencias

Ya están instaladas:
- `@walletconnect/modal`
- `@walletconnect/ethereum-provider`
- `@walletconnect/utils`

### 4. Uso

El componente `WalletButton` ya está integrado automáticamente. El flujo es:

1. El usuario hace clic en "Connect"
2. Se abre el modal de WalletConnect
3. El usuario selecciona MetaMask o cualquier otro wallet compatible
4. Se establece la conexión

## Componentes modificados

- **Providers.tsx**: Agregado `WalletConnectProvider`
- **wallet.ts store**: Actualizado para usar WalletConnect en lugar de Stellar
- **WalletButton.tsx**: Ya compatible, no requiere cambios

## Chains soportados

- Ethereum Mainnet (1)
- Sepolia (11155111)
- Polygon (137)
- Mumbai (80001)

Puedes agregar más chains en `/src/lib/walletconnect/config.ts`
