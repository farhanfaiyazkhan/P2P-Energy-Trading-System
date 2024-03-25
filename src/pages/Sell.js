import React from "react";
import Form from "../components/Form";
import { useAccount } from "../context/AccountContext";

const Sell = () => {
  const account = useAccount();

  const sellHandler = async (_amount, _price) => {
    const signer = await account.provider.getSigner();
    const transaction = await account.energyToken
      .connect(signer)
      .listSellRequest(_amount, _price);

    await transaction.wait();
  };

  return (
    <>
      <Form handler={sellHandler} />
    </>
  );
};

export default Sell;
