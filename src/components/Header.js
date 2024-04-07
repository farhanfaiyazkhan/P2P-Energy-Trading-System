import { useAccount } from "../context/AccountContext";

const Navigation = () => {
  const account = useAccount();
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          P2P Energy Trading
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/buy">
                Buy
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/sell">
                Sell
              </a>
            </li>
          </ul>

          {account.address ? (
            <button className="btn btn-outline-success" type="button">
              {account.address.slice(0, 6) +
                "..." +
                account.address.slice(38, 42)}
            </button>
          ) : (
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={account.loadConnectedAccount}
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
