import { useState } from "react";
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import { useNavigate  } from "react-router-dom";
import loginService from "@/utils/loginService";

function Login() {
    // Initialize useState variables for username and password
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [register, setRegister] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<boolean>(false);
    const [registerError, setRegisterError] = useState<boolean>(false);
    // Unpack login, setrole, url from Authentification Hook
    const { login, setRole, setUsers } = AuthentificationHook();
    // Initialize navigate
    const navigate = useNavigate();
    // initialize endpoints

    // Function to handle login endpoint
    const handleLogin = async () => {
        try {
            setRegisterError(false);
            setLoginError(false);
            let res;

             // Added if-conditional to check if user is being registered or not
            if (register){
                res = await loginService.register(username, password);

            }
            else {
                // if not register, login
                res = await loginService.login(username, password);
            }

            // Login and register take the same body format, use same code, just change url depending on registering or not.
            if (res){
                login(res.token);
                setRole(res.role);
                const users = await loginService.getUsers()
                setUsers(users)
                setLoginError(false);
                navigate("/home");
            }
            else {
                if (register){
                    setRegisterError(true);
                }
                else {
                    setLoginError(true);
                }
            }

        }
        catch (err){
            console.error(`Login error. Error: ${err}`);
        }
    }

    // Very simple login page, taken from bootstrap
    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="p-5 border border-secondary bg-light">
                    {loginError && 
                        <div className="fs-6 text-danger">
                            Invalid username or password. 
                        </div>
                    }
                    {registerError && 
                        <div className="fs-6 text-danger">
                            Username already taken. 
                        </div>
                    }
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