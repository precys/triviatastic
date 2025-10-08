import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


function ControlScreen({changeScreen, game}: ControlScreenProps) {
    const {game_id} = useParams();
    const navigate = useNavigate();

    function handleNext() {
        changeScreen();
    }
    function handleQuit() {
        axios.post(`http://localhost:3000/games/${game_id}/end`)
        navigate("/home");
    }
    function handleFinish() {

        navigate("/home");
    }

    return (
    <>
        <h1>Welcome!</h1>
        <h2>Score: {"TEST"}</h2>
        <div>
            <button onClick={() => {handleNext()}}>Start{}</button>
            <button onClick={() => {handleQuit()}}>Quit{}</button>
        </div>
    </>
    );
}

type ControlScreenProps = {
  changeScreen: () => void;
  game: object;
};

export default ControlScreen;