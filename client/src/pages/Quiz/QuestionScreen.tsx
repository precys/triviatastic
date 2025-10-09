import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthentificationHook from "../../components/Context/AuthentificationHook";

function QuestionScreen({changeScreen, game, setGame}: QuestionScreenProps) {
    const {token, logout} = AuthentificationHook();
    const {game_id} = useParams();

    function answerQuestion(selection: number) {
        const correct = true;

        axios.post(`http://localhost:3000/games/${game_id}/answer`,
            {
                questionDifficulty: game.questionDifficulty,
                correct
            },
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            })
        .then((response) => {
            setGame(response.data);
            changeScreen();
        })
        .catch((error) => {

        });
    }
    return (
    <>
        <h1>Question #{}:</h1>
        <p>{}</p>
        <div>
            <button onClick={() => {answerQuestion(0)}}>A: {}</button>
            <button onClick={() => {answerQuestion(1)}}>B: {}</button>
            <button onClick={() => {answerQuestion(2)}}>C: {}</button>
            <button onClick={() => {answerQuestion(3)}}>D: {}</button>
        </div>
    </>
    );
}

type QuestionScreenProps = {
  changeScreen: () => void;
  game: Game;
  setGame: React.Dispatch<React.SetStateAction<Game>>;
};

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

export default QuestionScreen;