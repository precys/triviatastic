import axios from "axios";
import { useState } from "react";

function Login() {
    const [username, setUsername] = useState<string>("");


    const login = async (username: string, password: string) => {
        try {
            const url = "http://localhost:3000/users/login"
            await axios
                .post(url, {})
                .then((response) => {
                    console.log(response);
                })
                .catch(err => console.error(`Error on login request. ${err}`))
            
        }
        catch (err){
            console.error(`Login error. Error: ${err}`);
        }
    }

    return (
        <>
        <div className="margin-auto">
            <form>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control"/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
        </>
    )
    }

export default Login