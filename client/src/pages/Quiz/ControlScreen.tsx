import { useNavigate, useParams, useLocation } from 'react-router-dom';
import gameService from '@/utils/gameService';


function ControlScreen({changeScreen, questionState, game}: ControlScreenProps) {
    const {game_id} = useParams();
    const {state} = useLocation();
    const navigate = useNavigate();

    const isNewGame = game.currentQuestion == 0;
    const isGameOver = game.currentQuestion >= state.settings.number;

    function handleNext() {
        changeScreen();
    }
    function handleQuit() {
        gameService.quitGame(game_id);
        navigate("/home");
    }
    function handleFinish() {
        gameService.finishGame(game_id, state.questions);
        navigate("/profile", {state: `I just scored ${game.score} in "${state.settings.category}" on ${state.settings.questionDifficulty} difficulty!`});
    }

    return (
    <>
            <div className = "bg-light card m-3">
            <h1 className="text-center m-3 p-3">{questionState}</h1>
            <h2 className="text-center m-3 p-3">Score: {game.score}</h2>
        </div>
        <div className="container-fluid p-4">
            {
                !isGameOver && (
                    isNewGame
                    ? <button className="btn btn-success btn-lg col-6 p-4" onClick={() => {handleNext()}}>Start</button>
                    : <button className="btn btn-light btn-lg col-6 p-4" onClick={() => {handleNext()}}>Next</button>
                )
            }

            {   
                isGameOver
                ? <button className="btn btn-success btn-lg col-12 p-4" onClick={() => {handleFinish()}}>Finish</button>
                : <button className="btn btn-danger btn-lg col-6 p-4" onClick={() => {handleQuit()}}>Quit</button>
            }
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