import axios from "axios";
import { useState } from "react";
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import { useNavigate  } from "react-router-dom";

function Login() {
    // Initialize useState variables for username and password
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [register, setRegister] = useState<boolean>(false);
    // Initialize login from Authentification Hook
    const { login, setRole } = AuthentificationHook();
    // Initialize navigate
    const navigate = useNavigate();

    // Function to handle login endpoint
    const handleLogin = async () => {
        try {
            let url = "";
            const body = {
                    username: username,
                    password: password,
            }

             // Added if-conditional to check if user is being registered or not
            if (register){
                url = "http://localhost:3000/users/register";

            }
            else {
                // if not register, login
                url = "http://localhost:3000/users/login";
            }

            // Login and register take the same body format, use same code, just change url depending on registering or not.
            await axios
                .post(url, body)
                .then((response) => {
                    const token = response.data.token;
                    const userRole = response.data.role;

                    login(token);
                    setRole(userRole)
                    navigate("/home");
                })
                .catch(err => console.error(`Error on axios request. ${err}`))
            
        }
        catch (err){
            console.error(`Login error. Error: ${err}`);
        }
    }

    // Very simple login page, taken from bootstrap
    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="p-2">
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-text">
                            <input className="form-check-input mt-0" type="checkbox" onChange={(e) => setRegister(e.target.checked)} /> <span className="ms-1"> Register </span>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleLogin()}>Submit</button>
                </div>
            </div>
        </>
    )
    }

export default Login