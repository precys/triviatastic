import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AuthentificationHook from "../../components/Context/AuthentificationHook";


function ControlScreen({changeScreen, game}: ControlScreenProps) {
    const {token, logout} = AuthentificationHook();
    const {game_id} = useParams();
    const {state} = useLocation();
    const navigate = useNavigate();

    const isNewGame = game.currentQuestion == 0;
    const isGameOver = game.currentQuestion > state.settings.number;

    function handleNext() {
        changeScreen();
    }
    function handleQuit() {
        axios.post(`http://localhost:3000/games/${game_id}/end`,
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            }
        );
        navigate("/home");
    }
    function handleFinish() {
        axios.post(`http://localhost:3000/games/${game_id}/finish`,
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            }
        );
        navigate("/home");
    }

    return (
    <>
        <h1>Welcome!</h1>
        <h2>Score: {game.score}</h2>
        <div>
            <button onClick={() => {handleNext()}}>{isNewGame ? "Start" : "Next"}</button>
            <button onClick={() => {isGameOver ? handleFinish() : handleQuit()}}>{isGameOver ? "Quit" : "Finish"}</button>
        </div>
    </>
    );
}

type Game = {
    PK: string;
    SK: string;
    gameId: string,
    userId: string,
    category: string
    currentQuestion: number,
    score: number,
    finished: boolean,
    createdAt: Date,
    questionDifficulty: string
}

type ControlScreenProps = {
  changeScreen: () => void;
  game: Game;
  setGame: React.Dispatch<React.SetStateAction<Game>>;
};

export default ControlScreen;