# 🔑 Obtener Project ID de WalletConnect

## Pasos para obtener tu Project ID

### 1. Ir a WalletConnect Cloud
Abre: **https://cloud.walletconnect.com**

### 2. Crear una cuenta
- Haz clic en **"Sign In"** o **"Create Account"**
- Ingresa tu email
- Crea una contraseña
- Verifica tu email

### 3. Crear un nuevo proyecto
- En el dashboard, haz clic en **"Create Project"** o **"New Project"**
- Completa el formulario:
  - **Project Name**: Nombre de tu app (ej: "Mi Trading App")
  - **Project Type**: Selecciona **"Web"** o **"Web3 App"**
  - **Project URL**: La URL de tu sitio (ej: http://localhost:3000)
  - **Description**: Descripción opcional

### 4. Copiar tu Project ID
- Después de crear el proyecto, verás tu **Project ID**
- Es un string largo en hexadecimal (ej: `a1b2c3d4e5f6...`)
- **Cpia exactamente este ID**

### 5. Configurar en tu proyecto

Abre `.env.local` en la raíz del proyecto:

```env
# Antes (placeholder):
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Después (con tu ID real):
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**⚠️ IMPORTANTE**: 
- El ID debe ser el **real**, no un placeholder
- No lleva comillas
- Reinicia el servidor después de cambiar `.env.local`

### 6. Reiniciar el servidor

```bash
bun run dev
```

### 7. Probar

- Abre http://localhost:3000
- Haz clic en **"Connect"**
- Ahora debería mostrar wallets disponibles (MetaMask, WalletConnect, etc.)

---

## En caso de problemas

### Modal vacío o "No wallets found"
- ❌ Project ID inválido o placeholder
- ✅ Solución: Usa tu Project ID **real** de WalletConnect Cloud

### Error "Project ID not set"
- ❌ `.env.local` no tiene la variable
- ✅ Solución: Crea `.env.local` y agrega el Project ID

### No funciona después de cambiar `.env.local`
- ❌ Servidor viejo en cache
- ✅ Solución: Recarga la página (Ctrl+R o Cmd+R)

### Sigue sin funcionar
- Revisa la consola de navegador (F12 → Console)
- Busca mensajes de error de WalletConnect
- Verifica que el Project ID sea válido

---

## 🔗 Enlaces útiles

- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Documentación WalletConnect](https://docs.walletconnect.network/app-sdk/overview)
- [Ethereum Provider Spec](https://eips.ethereum.org/EIPS/eip-1193)
