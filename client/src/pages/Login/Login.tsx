import axios from "axios";
import { useState } from "react";
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import { useNavigate  } from "react-router-dom";

function Login() {
    // Initialize useState variables for username and password
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // Initialize login from Authentification Hook
    const { login } = AuthentificationHook();
    // Initialize navigate
    const navigate = useNavigate();

    // Function to handle login endpoint
    const handleLogin = async () => {
        try {
            const url = "http://localhost:3000/users/login";
            const body = {
                username: username,
                password: password,
            }

            await axios
                .post(url, body)
                .then((response) => {
                    const token = response.data.token;
                    login(token);
                    navigate("/home");
                })
                .catch(err => console.error(`Error on login request. ${err}`))
            
        }
        catch (err){
            console.error(`Login error. Error: ${err}`);
        }
    }

    // Very simple login page, taken from bootstrap
    return (
        <>
            <div className="margin-auto">
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button className="btn btn-primary" onClick={() => handleLogin()}>Submit</button>
            </div>
        </>
    )
    }

export default Login