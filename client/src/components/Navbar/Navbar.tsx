import { Link } from "react-router-dom";
import AuthentificationHook from "../Context/AuthentificationHook"

function Navbar() {
  const { userRole } = AuthentificationHook();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            Home
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/feed">
                  Feed
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create-game">
                  Create Game
                </Link>
              </li>
              {userRole == "ADMIN" &&               
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Admin
                  </Link>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
