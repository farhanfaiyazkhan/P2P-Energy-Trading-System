import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import Card from "../components/Card";
import { useAccount } from "../context/AccountContext";
import { ethers } from "ethers";
import config from "../config.json";
import EnergyToken from "../abis/EnergyToken.json";


const Sell = () => {
  const account = useAccount();
  const [bids, setBids] = useState([]);

  const sellHandler = async (_amount, _price) => {
    const signer = await account.provider.getSigner();
    const transaction = await account.energyToken
      .connect(signer)
      .listSellRequest(_amount, _price);

    await transaction.wait();
  };

  const getBids = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const network = await provider.getNetwork();

    const deploy = config[network.chainId].EnergyToken.address;

    const energyToken = new ethers.Contract(deploy, EnergyToken, provider);
    const bids = [];

    const totalBids = await energyToken.totalBids();

    for (var i = 1; i <= totalBids; ++i) {
      const bid = await energyToken.getBid(i);
      console.log({status : bid.status.toString()});
      bids.push(bid);
    }

    setBids(bids);
  };

  const acceptHandler = async (_id) => {
    try {
      const signer = await account.provider.getSigner();
      const transaction = await account.energyToken
        .connect(signer)
        .acceptBid(_id);
      
      await transaction.wait();

      await getBids();

    } catch (error) {
      console.log("Error accepting bid:", error);
    }
  }


  const completeHandler = async (_id, _price) => {
    try {
      const signer = await account.provider.getSigner();
      const transaction = await account.energyToken
        .connect(signer)
        .completeBid(_id, { value: _price, gasLimit: 5000000 });

      await transaction.wait();

      await getBids();

    } catch (error) {
      console.error("Error purchasing energy:", error);
    }
  };


  useEffect(() => {
    getBids();
  }, []);

  return (
    <>
      <Form handler={sellHandler} />

      <div className="cards">
        {bids.map((bid, index) => (
          <Card
            request={bid}
            key={index}
            acceptHandler={acceptHandler}
            completeHandler={completeHandler}
          />
        ))}
      </div>
    </>
  );
};

export default Sell;
