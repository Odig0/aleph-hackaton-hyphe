# WalletConnect + MetaMask Integration Guide

## ✅ Instalación Completada

He integrado exitosamente **WalletConnect** con **MetaMask** en tu proyecto. Aquí está el resumen:

## 📦 Paquetes Instalados

```bash
@walletconnect/modal@2.7.0
@walletconnect/ethereum-provider@2.23.8
@walletconnect/utils@2.23.8
```

## 🔧 Archivos Creados

### Configuración de WalletConnect
- **`src/lib/walletconnect/config.ts`** - Configuración principal del proveedor
- **`src/lib/walletconnect/hooks.ts`** - Hook `useWalletConnect()` personalizado
- **`src/lib/walletconnect/provider.tsx`** - Proveedor de React para WalletConnect
- **`src/lib/walletconnect/index.ts`** - Archivo de exportación

## 📝 Archivos Modificados

1. **`src/stores/wallet.ts`**
   - Actualizado para usar WalletConnect en lugar de Stellar
   - Mantiene la misma interfaz para compatibilidad con componentes existentes

2. **`src/components/layout/Providers.tsx`**
   - Agregado `WalletConnectProvider` al árbol de componentes

3. **`src/components/layout/WalletButton.tsx`**
   - Ya compatible, sin cambios necesarios

4. **`src/hooks/useWallet.ts`**
   - Sin cambios, continúa usando el store de Zustand

## 🚀 Cómo Usar

### 1. Obtener Project ID

1. Ve a [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia el **Project ID**

### 2. Configurar Variables de Entorno

Edita `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
```

### 3. Iniciar el Servidor

```bash
bun run dev
```

### 4. Probar la Integración

1. Haz clic en **"Connect"** en la esquina superior derecha
2. Se abre el modal de WalletConnect
3. Selecciona **MetaMask** o tu wallet preferido
4. Confirma la conexión en tu wallet
5. ¡Listo! Tu wallet está conectado

## 🔗 Redes Soportadas

Por defecto están configuradas:
- **Ethereum Mainnet** (ID: 1)
- **Sepolia** (ID: 11155111)
- **Polygon** (ID: 137)
- **Mumbai** (ID: 80001)

Para agregar más redes, edita `src/lib/walletconnect/config.ts`:

```typescript
chains: [1, 11155111, 137, 80001, 42161], // Agregué Arbitrum (42161)
```

## 🎯 Componentes y Hooks

### Componente: WalletButton
Ya está integrado en el `Navbar` y maneja automáticamente:
- Conexión del wallet
- Mostrar dirección truncada
- Mostrar balance de USDC
- Copiar dirección
- Solicitar USDC del faucet
- Desconectar

### Hook: useWallet
```typescript
import { useWallet } from "@/hooks/useWallet";

function MyComponent() {
  const { connected, address, connecting, connect, disconnect } = useWallet();
  
  return (
    <button onClick={connect} disabled={connecting}>
      {connecting ? "Conectando..." : "Conectar"}
    </button>
  );
}
```

### Hook Alternativo: useWalletConnect
Para acceso más directo:
```typescript
import { useWalletConnect } from "@/lib/walletconnect";

function MyComponent() {
  const { address, isConnected, connect, disconnect, error } = useWalletConnect();
  // ...
}
```

## 🔒 Características

✅ **Soporte para MetaMask** y otros wallets EVM  
✅ **Modal elegante** de WalletConnect  
✅ **Manejo automático** de eventos de conexión  
✅ **Cambios de cuenta** sincronizados automáticamente  
✅ **Desconexión** segura  
✅ **Gestión de errores** robusta  

## 📚 Documentación Oficial

- [WalletConnect Docs](https://docs.walletconnect.network/app-sdk/overview)
- [Ethereum Provider Spec](https://eips.ethereum.org/EIPS/eip-1193)

## ❓ Troubleshooting

### "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set"
- Asegúrate de haber creado el `.env.local`
- Reinicia el servidor después de agregar la variable

### Modal no se abre
- Verifica que NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID sea válido
- Revisa la consola del navegador para errores

### MetaMask no aparece en el modal
- Asegúrate de tener MetaMask instalado
- Verifica que el Project ID esté correcto en WalletConnect Cloud

## 🎉 ¡Listo!

¡Tu integración de WalletConnect con MetaMask está lista!  
Usa el botón "Connect" en la interfaz para comenzar.
