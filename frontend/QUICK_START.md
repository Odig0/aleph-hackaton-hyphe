# ✅ WalletConnect Setup - Guía Rápida

## El problema actual

El modal de WalletConnect se abre pero muestra **vacío** porque falta tu **Project ID real** de WalletConnect Cloud.

## ⚡ Solución en 3 pasos

### Paso 1: Obtener Project ID (5 minutos)

1. Ve a: **https://cloud.walletconnect.com**
2. Haz clic en **"Sign In"** o **"Create Account"**
3. Inicia sesión / Crea tu cuenta
4. Haz clic en **"Create Project"**
5. Rellena el formulario y crea el proyecto
6. **Copia el Project ID** (es un código largo)

📖 **Guía detallada**: Lee `GET_PROJECT_ID.md`

### Paso 2: Configurar Project ID

Edita el archivo **`.env.local`** en la raíz del proyecto:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_REAL_PROJECT_ID_HERE
```

Reemplaza `YOUR_REAL_PROJECT_ID_HERE` con tu ID real (el que copiaste del paso 1).

**❌ NO HAGAS ESTO:**
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here  # ❌ PLACEHOLDER
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=123456                # ❌ FAKE ID
```

**✅ HAZ ESTO:**
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6  # ✅ REAL ID
```

### Paso 3: Reiniciar

Abre una terminal en el proyecto:

```bash
# Matca el servidor anterior (Ctrl+C)
# Luego inicia de nuevo:
bun run dev
```

## ✨ Listo!

Ahora:
1. Abre http://localhost:3000
2. Haz clic en **"Connect"**
3. **Deberías ver wallets disponibles** (MetaMask, WalletConnect, etc.)

---

## 🆘 Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Modal vacío sin wallets | Project ID inválido | Verifica que uses el Project ID real |
| "Project ID not set" error | `.env.local` no configurado | Agrega `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...` |
| Modal aún vacío después de cambiar `.env.local` | Caché del servidor | Recarga la página (Ctrl+R o Cmd+R) |
| Error en consola | Diferentes razones | Abre F12 → Console y revisa el error |

---

## 📚 Más información

- **Guía completa**: `GET_PROJECT_ID.md`
- **WalletConnect Cloud**: https://cloud.walletconnect.com
- **Docs**: https://docs.walletconnect.network

---

## 🎯 Resumen

```
1. Project ID real → https://cloud.walletconnect.com
2. Configura .env.local
3. Reinicia servidor
4. ¡Listo!
```

¡Cualquier duda, revisa `GET_PROJECT_ID.md` paso por paso! 🚀
