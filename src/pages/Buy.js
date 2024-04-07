import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import Card from "../components/Card";
import { useAccount } from "../context/AccountContext";
import { ethers } from "ethers";
import config from "../config.json";
import EnergyToken from "../abis/EnergyToken.json";

const Buy = () => {
  const account = useAccount();
  const [sellRequests, setSellRequests] = useState([]);

  const buyHandler = async (_amount, _price) => {
    const signer = await account.provider.getSigner();
    const transaction = await account.energyToken
      .connect(signer)
      .listBid(_amount, _price);

    await transaction.wait();
  };

  const getSellRequests = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const network = await provider.getNetwork();

    const deploy = config[network.chainId].EnergyToken.address;

    const energyToken = new ethers.Contract(deploy, EnergyToken, provider);
    const sellRequests = [];

    const totalSellRequests = await energyToken.totalSellRequests();

    for (var i = 1; i <= totalSellRequests; ++i) {
      const sellRequest = await energyToken.getSellRequest(i);
      console.log({request : sellRequest.status.toString()});
      sellRequests.push(sellRequest);
    }

    setSellRequests(sellRequests);
  };

  const completeHandler = async (_id, _price) => {
    try {
      const signer = await account.provider.getSigner();
      const transaction = await account.energyToken
        .connect(signer)
        .buyEnergy(_id, { value: _price, gasLimit: 5000000 });

      await transaction.wait();

      await getSellRequests();

    } catch (error) {
      console.error("Error purchasing energy:", error);
    }
  };

  useEffect(() => {
    getSellRequests();
  }, []);

  return (
    <>
      <Form handler={buyHandler} />

      <div className="cards">
        {sellRequests.map((sellRequest, index) => (
          <Card
            request={sellRequest}
            key={index}
            completeHandler={completeHandler}
          />
        ))}
      </div>
    </>
  );
};

export default Buy;
