import { useNavigate, useParams } from 'react-router-dom';
import MultipleChoice from './MultipleChoice';
import gameService from '@/utils/gameService';

function QuestionScreen({changeScreen, setGame, question}: QuestionScreenProps) {
    function playSoundEffect(correct: boolean) {
        const soundToPlay = correct ? correctSound : incorrectSound;

        if(soundToPlay) {
            soundToPlay.play();
        }
    }
    function answerQuestion(selection: string) {
        const correct = question.correct_answer === selection;

        gameService.answer(game_id, question.difficulty, correct)
        .then((response) => {
            setGame(response.data);
            playSoundEffect(correct);
            changeScreen(correct ? "Correct!" : "Incorrect.");
            question.userAnsweredCorrectly = correct;
        })
        .catch((error) => {
            console.error(error);
            navigate("/home");
        });
    }

    const navigate = useNavigate();
    const {game_id} = useParams();

    const correctSound = new Audio("/correct.mp3");
    const incorrectSound = new Audio("/incorrect.mp3");

    const answers: string[] = [...question.incorrect_answers, question.correct_answer];
    randomShuffle(answers);

    return (
    <>
        <div className = "bg-light card m-3">
            <h1 className="text-center m-3">Question: </h1>
            <p className="text-center m-3">{format(question.question)}</p>
        </div>
        <MultipleChoice answers={answers} answerQuestion={answerQuestion}/>
    </>
    );
}

function format(input: String) : String {
    return input.replaceAll("&#039;", "\'").replaceAll("&rsquo;", "\'").replaceAll('&quot;', '\"').replaceAll("&amp;", "&");
}
function randomShuffle(array: string[]) : void {    
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
    status?: string,
    createdAt?: Date,
    userAnsweredCorrectly?: boolean
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