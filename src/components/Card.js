import { ethers } from "ethers";

const Card = ({ request, text, handler }) => {
  const handleSubmit = async (e) => {
    await handler(request.id, request.price);
  };

  return (
    <div className="card_main">
      <div className="card__info">
        <p className="card__date">
          <strong>{request.amount.toString()}</strong>
          Watt Hour
        </p>

        <h3 className="card__name">{request.creator}</h3>

        <p className="card__cost">
          <strong>{request.price.toString()}</strong>
          ETH
        </p>

        {request.status ? (
          <button type="button" className="card__button" onClick={handleSubmit}>
            {text}
          </button>
        ) : (
          <button type="button" className="card__button--out" disabled>
            Completed
          </button>
        )}
      </div>

      <hr />
    </div>
  );
};

export default Card;
