import { buyNodeRed } from "../node_red/index";

const Card = ({ request, completeHandler, acceptHandler }) => {
  const handleCompleteSubmit = async (e) => {
    await completeHandler(request.id, request.price);

    const time = request.amount * 100;

    await buyNodeRed(time);
  };

  const handleAcceptSubmit = async (e) => {
    await acceptHandler(request.id);
  }

  const adrs = request.creator.toString();
  const prc = request.price.toString();

  return (
    <div className="card__main">
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

        {request.status == 2 ? (
          <button type="button" className="card__button" onClick={handleAcceptSubmit}>
            Waiting...
          </button>
        ) : request.status == 1 ? (
          <button type="button" className="card__button" onClick={handleCompleteSubmit}>
            Buy Energy
          </button>
        ) : request.status == 0 ? (
          <button type="button" className="card__button--out" disabled>
            Completed
          </button>
        ) : null}


      </div>

      <hr />
    </div>
  );
};

export default Card;
