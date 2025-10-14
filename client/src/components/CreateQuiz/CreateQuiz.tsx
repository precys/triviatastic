import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import axios from "axios";

function CreateQuiz() {
    const [settings, setSettings] = useState<Settings>({category: "any", questionDifficulty: "easy", number: 10});
    const navigate = useNavigate();
    const {token, logout} = AuthentificationHook();

    function newGame() {
        axios.post("http://localhost:3000/games/start", 
            {
                category: settings.category,
                questionDifficulty: settings.questionDifficulty
            },
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            })
        .then((response) => {
            console.log(response.data);
            getQuestions(settings, response.data);
        })
        .catch((error) => {
            console.log(error);
            if (error.response.status == 401){
              logout();
              navigate("/");
            }
        });
    }

    function getQuestions(settings: Settings, game: Game) {
        axios.get(`http://localhost:3000/questions/category?category=${settings.category}&n=${settings.number}&difficulty=${settings.questionDifficulty}&type=any`,
            {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            })
            .then((response) => {
                const questions : Array<Question> = response.data.questions;
                console.log(`Success, length : ${questions.length}`);
                navigate(`/quiz/${game.gameId}`, {state: {settings, game, questions}});
            })
            .catch((error) => {
                console.error(error);
                if(error.response.status == 404) {

                    axios.post(`http://localhost:3000/games/${game.gameId}/end`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}` 
                            }
                        }
                    );

                    alert("Not enough questions");
                }
            });
    }
    

    return (
        <div className="bg-light card mb-2 m-3">
            <h1 className="m-3 p-3">Create Game</h1>
            <div className="center m-3 justify-content-center">
                <label className="m-3" htmlFor="number">Number of Questions: </label>
                <select value = {settings.number} id = "number" onChange={(e) => {setSettings({...settings, number: parseInt(e.target.value)})}}>
                    <option value = {10}>10</option>
                    <option value = {20}>20</option>
                    <option value = {30}>30</option>
                    <option value = {40}>40</option>
                    <option value = {50}>50</option>
                </select>

                <label className="m-3" htmlFor="category">Category: </label>
                <select value = {settings.category} id = "category" onChange={(e) => {setSettings({...settings, category: e.target.value})}}>
                    <option value = "any">Any</option>
                    <option value = "art">Art</option>
                    <option value = "history">History</option>
                    <option value = "mythology">Mythology</option>
                    <option value = "sports">Sports</option>
                </select>

                <label className="m-3" htmlFor="difficulty">Difficulty: </label>
                <select value = {settings.questionDifficulty} id = "difficulty" onChange={(e) => {setSettings({...settings, questionDifficulty: e.target.value})}}>
                    <option value = "any">Random</option>
                    <option value = "easy">Easy</option>
                    <option value = "medium">Medium</option>
                    <option value = "hard">Hard</option>
                </select>


                <button className="btn btn-success m-3 float-end" onClick={newGame}>Start Game</button>

            </div>
        
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

type Settings = {
    number: number;
    questionDifficulty: string;
    category: string;
}

export default CreateQuiz;