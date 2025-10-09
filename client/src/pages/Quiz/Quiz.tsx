import {useState, useEffect} from "react";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import QuestionScreen from "./QuestionScreen";
import ControlScreen from "./ControlScreen";

function Quiz() {
    const {state} = useLocation();
    const [questionLoaded, setQuestionLoaded] = useState(false);
    const [game, setGame] = useState(state.game);

    const {game_id} = useParams();

    function changeScreen() {
        console.log(questionLoaded);
        setQuestionLoaded(!questionLoaded);
    }

    return (
    <div>
        <p>{game_id}</p>
        {questionLoaded 
        ? <QuestionScreen changeScreen={changeScreen} game={game} setGame={setGame}/> 
        : <ControlScreen changeScreen={changeScreen} game={game} setGame={setGame}/>}
    </div>
    );
}

type Game = {
    PK: string;
    SK: string;
    gameId: string;
    userId: string;
    category: string;
    currentQuestion: number;
    score: number;
    finished: boolean;
    createdAt: Date;
    questionDifficulty: string;
}

export default Quiz;