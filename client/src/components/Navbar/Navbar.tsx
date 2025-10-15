import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthentificationHook from "../Context/AuthentificationHook"
import { userFromToken } from "@/utils/userFromToken";

function Navbar() {
  const { userRole, logout, users } = AuthentificationHook();
  const [selectedUser, setSelectedUser] = useState("");

  const currentUser = userFromToken()
  const filteredUsers = users.filter((user) => user.userId !== currentUser.userId)
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  }

  const handleUserLookup = (username: string) => {
    if (username) {
      setSelectedUser("");
      navigate(`/profile/${username}`)
    }
  }

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
              <li className="nav-item">
                <Link className="nav-link" to="/submit-question">
                  Submit Question
                </Link>
              </li>

              {userRole == "ADMIN" &&               
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Admin
                  </Link>
                </li>
              }

              <form className="d-flex" role="search">
                <select className="form-select" onChange={(e) => {setSelectedUser(e.target.value); handleUserLookup(e.target.value);}} value={selectedUser}>
                  <option value="">Search Users</option>
                  {filteredUsers.map((user) => (
                    <option key={user.username} value={user.username}> {user.username} </option>
                  ))}
                </select>
              </form>

            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item ms-auto">
                <Link className="nav-link" to="/" onClick={() => handleLogout()}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
