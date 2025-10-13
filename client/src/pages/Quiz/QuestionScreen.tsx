import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import MultipleChoice from './MultipleChoice';

function QuestionScreen({changeScreen, setGame, question}: QuestionScreenProps) {
    function answerQuestion(selection: string) {
        const correct = question.correct_answer === selection;

        axios.post(`http://localhost:3000/games/${game_id}/answer`,
            {
                questionDifficulty: question.difficulty,
                correct
            },
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            })
        .then((response) => {
            setGame(response.data);
            changeScreen(correct ? "Correct!" : "Incorrect.");
        })
        .catch((error) => {
            console.error(error);
            navigate("/home");
        });
    }

    const navigate = useNavigate();
    const {token} = AuthentificationHook();
    const {game_id} = useParams();

    const answers: string[] = [...question.incorrect_answers, question.correct_answer];
    randomShuffle(answers);
    return (
    <>
        <h1 className="text-center m-3">Question: </h1>
        <p className="text-center m-3">{question.question}</p>
        <MultipleChoice answers={answers} answerQuestion={answerQuestion}/>
    </>
    );
}

function randomShuffle(array: string[]) {    
    if(Math.random() > 0.5) {
        array.reverse();
    }
    
    const shift = Math.floor(Math.random() * (array.length - 1));
    let i = 0;
    while(i < shift) {
        array.push(array.shift() as string);
        i++;
    }

    if(Math.random() > 0.25 && array.length > 2) {
        const temp: string = array[array.length-2];
        array[array.length-2] = array[array.length-3];
        array[array.length-3] = temp;
    }
}

type QuestionScreenProps = {
  changeScreen: (newState?: string) => void;
  setGame: React.Dispatch<React.SetStateAction<Game>>;
  question: Question;
};

type Question = {
    PK?: string
    SK?: string
    category: string,
    questionId?: string,
    userId?: string,
    type: string,
    difficulty: string,
    question: string,
    correct_answer: string,
    incorrect_answers: Array<string>,
    status?: string
    createdAt?: Date
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

export default QuestionScreen;