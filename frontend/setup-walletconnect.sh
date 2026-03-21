#!/bin/bash

# Quick WalletConnect Setup Script
# Este script ayuda a configurar WalletConnect en el proyecto

echo "🔗 WalletConnect Setup for MetaMask Integration"
echo "=================================================="
echo ""
echo "Paso 1: Obtén tu Project ID"
echo "  1. Ve a https://cloud.walletconnect.com"
echo "  2. Crea una cuenta o inicia sesión"
echo "  3. Crea un nuevo proyecto"
echo "  4. Copia el Project ID"
echo ""
echo "Paso 2: Configura el .env.local"
echo "  Edita el archivo .env.local y reemplaza:"
echo "  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here"
echo "  con tu Project ID real"
echo ""
echo "Paso 3: Inicia el servidor"
echo "  bun run dev"
echo ""
echo "Paso 4: Prueba la conexión"
echo "  1. Haz clic en 'Connect' en la esquina superior derecha"
echo "  2. Selecciona MetaMask en el modal de WalletConnect"
echo "  3. Confirma la conexión en tu wallet"
echo ""
echo "✅ ¡Listo!"
