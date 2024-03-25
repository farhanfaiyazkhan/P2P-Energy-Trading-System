import React, { useState } from "react";

const Form = ({ handler }) => {
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handler(amount, price);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  return (
    <form className="mx-5 my-5" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="energyAmount" className="form-label">
          Energy Amount
        </label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={handleAmountChange}
          id="energyAmount"
          aria-describedby="amoutHelp"
        />
        <div id="amoutHelp" className="form-text">
          in Watt Hour
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="price" className="form-label">
          Price
        </label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={handlePriceChange}
          id="price"
          aria-describedby="priceHelp"
        />
        <div id="priceHelp" className="form-text">
          in ETH
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Form;
