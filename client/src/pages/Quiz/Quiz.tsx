import {useState} from "react";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import axios from "axios";
import QuestionScreen from "./QuestionScreen";
import ControlScreen from "./ControlScreen";

function Quiz() {
    const [questionLoaded, setQuestionLoaded] = useState(false);
    const {game_id} = useParams();
    const {state} = useLocation();
    const game = state.game;
    const numQuestions = state.settings.number;

    function changeScreen() {
        console.log(questionLoaded);
        setQuestionLoaded(!questionLoaded);
    }

    return (
    <div>
        <p>{game_id}</p>
        {questionLoaded 
        ? <QuestionScreen changeScreen={changeScreen} game={game}/> 
        : <ControlScreen changeScreen={changeScreen} game={game}/>}
    </div>
    );
}

export default Quiz;