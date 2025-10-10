import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AuthentificationHook from "../../components/Context/AuthentificationHook";


function ControlScreen({changeScreen, questionState, game}: ControlScreenProps) {
    const {token} = AuthentificationHook();
    const {game_id} = useParams();
    const {state} = useLocation();
    const navigate = useNavigate();

    const isNewGame = game.currentQuestion == 0;
    const isGameOver = game.currentQuestion >= state.settings.number;

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
        <h1>{questionState}</h1>
        <h2>Score: {game.score}</h2>
        <div>
            {!isGameOver && <button onClick={() => {handleNext()}}>{isNewGame ? "Start" : "Next"}</button>}
            <button onClick={() => {isGameOver ? handleFinish() : handleQuit()}}>{isGameOver ? "Finish" : "Quit"}</button>
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
  questionState: string;
  game: Game;
};

export default ControlScreen;