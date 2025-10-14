import {useState} from "react";
import {useLocation} from 'react-router-dom';

import QuestionScreen from "./QuestionScreen";
import ControlScreen from "./ControlScreen";

function Quiz() {
    function changeScreen(newState?: string) {
        if (newState) {
            setQuestionState(newState);
        }
        else {
            setQuestionState("Loaded");
        }
    }

    const {state} = useLocation();

    const [questionState, setQuestionState] = useState<string>("Welcome!");
    const [game, setGame] = useState<Game>(state.game);
    
    const questions = state.questions;

    return (
    <div>
        {questionState === "Loaded" 
        ? <QuestionScreen changeScreen={changeScreen} setGame={setGame} question={questions[game.currentQuestion]}/> 
        : <ControlScreen changeScreen={changeScreen} game={game} questionState={questionState}/>}
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