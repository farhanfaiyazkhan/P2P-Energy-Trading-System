import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import config from "../config.json";
import EnergyToken from "../abis/EnergyToken.json";

const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
  const [address, setAddress] = useState(() => {
    const savedAddress = localStorage.getItem("connectedAddress");
    return savedAddress ? savedAddress : null;
  });

  const [provider, setProvider] = useState(null);

  const [energyToken, setEnergyToken] = useState(null);

  const loadConnectedAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = ethers.utils.getAddress(accounts[0]);
    setAddress(address);
    localStorage.setItem("connectedAddress", address);
  };

  useEffect(() => {
    async function connectToChain() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const network = await provider.getNetwork();

      const deploy = config[network.chainId].EnergyToken.address;

      const energyToken = new ethers.Contract(deploy, EnergyToken, provider);
      setEnergyToken(energyToken);

      await window.ethereum.on("accountsChanged", async () => {
        loadConnectedAccount();
      });
    }
    connectToChain();
  }, []);

  const value = {
    address,
    loadConnectedAccount,
    energyToken,
    provider,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
