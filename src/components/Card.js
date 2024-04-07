import { buyNodeRed } from "../node_red/index";

const Card = ({ request, text, handler }) => {
  const handleSubmit = async (e) => {
    await handler(request.id, request.price);

    const time = request.amount * 10;

    await buyNodeRed(time);
  };

  const adrs = request.creator.toString();
  const prc = request.price.toString();

  return (
    <div className="card">
      <div className="card__info">
        <p className="card__date">
          <strong>{request.amount.toString()}</strong>
          Watt Hour
        </p>

        <h3 className="card__name">{adrs.slice(0,6) + "..." + adrs.slice(38,42)}</h3>

        <p className="card__cost">
          <strong>{prc.slice(0, prc.length - 18)}</strong>
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
