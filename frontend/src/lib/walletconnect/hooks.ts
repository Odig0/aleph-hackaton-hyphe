"use client";

import { useEffect, useState, useCallback } from "react";
import { getProvider } from "./config";

export function useWalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Inicializar provider
  useEffect(() => {
    const init = async () => {
      try {
        const p = await getProvider();
        setProvider(p);

        // Verificar si ya está conectado
        try {
          const accounts = await p.request({ method: "eth_accounts" });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (e) {
          // No conectado aún
        }

        // Setup listeners
        if (p) {
          const handleAccountsChanged = (accounts: string[]) => {
            if (accounts && accounts.length > 0) {
              setAddress(accounts[0]);
              setIsConnected(true);
            } else {
              setAddress(null);
              setIsConnected(false);
            }
          };

          const handleDisconnect = () => {
            setAddress(null);
            setIsConnected(false);
          };

          p.on("accountsChanged", handleAccountsChanged);
          p.on("disconnect", handleDisconnect);

          return () => {
            p.removeListener("accountsChanged", handleAccountsChanged);
            p.removeListener("disconnect", handleDisconnect);
          };
        }
      } catch (err) {
        console.error("Error inicializando:", err);
        setError(
          err instanceof Error ? err.message : "Error al inicializar"
        );
      }
    };

    init();
  }, []);

  const connect = useCallback(async () => {
    if (!provider) {
      setError("Provider no inicializado");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await provider.enable();
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error conectando";
      setError(msg);
      console.error("Error en conexión:", err);
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  const disconnect = useCallback(async () => {
    if (!provider) return;

    try {
      await provider.disconnect();
      setAddress(null);
      setIsConnected(false);
    } catch (err) {
      console.error("Error desconectando:", err);
    }
  }, [provider]);

  return {
    address,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    provider,
  };
}
