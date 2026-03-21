import { EthereumProvider } from "@walletconnect/ethereum-provider";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.error(
    "❌ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID no está configurado. Obtén uno en https://cloud.walletconnect.com"
  );
}

let ethereumProvider: any = null;

export async function initEthereumProvider() {
  if (ethereumProvider) {
    return ethereumProvider;
  }

  if (!projectId) {
    throw new Error(
      "Project ID no configurado. Ve a https://cloud.walletconnect.com y obtén uno"
    );
  }

  try {
    ethereumProvider = await EthereumProvider.init({
      projectId,
      chains: [1, 11155111, 137, 80001],
      methods: [
        "eth_sendTransaction",
        "eth_signTransaction",
        "eth_sign",
        "personal_sign",
        "eth_signTypedData",
      ],
      events: ["chainChanged", "accountsChanged"],
      showQrModal: true,
      rpcMap: {
        1: "https://eth.rpc.blxrbdn.com",
        11155111: "https://sepolia.infura.io/v3/YOUR_INFURA_ID",
        137: "https://polygon-rpc.com",
        80001: "https://rpc-mumbai.maticvigil.com",
      },
    });

    return ethereumProvider;
  } catch (error) {
    ethereumProvider = null;
    console.error("Error inicializando WalletConnect:", error);
    throw error;
  }
}

export async function getProvider() {
  return initEthereumProvider();
}
