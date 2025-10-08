import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import axios from "axios";

function CreateQuiz() {
    const [settings, setSettings] = useState({category: "any", questionDifficulty: "easy", number: 10});
    const navigate = useNavigate();
    const { token, logout } = AuthentificationHook();

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
            navigate(`/quiz/${response.data.gameId}`, {state: {settings, game: response.data}});
        })
        .catch((error) => {
            console.log(error);
            if (error.response.status == 401){
              logout();
              navigate("/");
            }
        });
    }

    return (
        <>
            <h1>Create Game</h1>
            <div>
                <label htmlFor="number">Category: </label>
                <select value = {settings.category} id = "number" onChange={(e) => {setSettings({...settings, number: parseInt(e.target.value)})}}>
                    <option value = {10}>10</option>
                    <option value = {20}>20</option>
                    <option value = {30}>30</option>
                    <option value = {40}>40</option>
                    <option value = {50}>50</option>
                </select>

                <label htmlFor="category">Category: </label>
                <select value = {settings.category} id = "category" onChange={(e) => {setSettings({...settings, category: e.target.value})}}>
                    <option value = "any">Any</option>
                    <option value = "art">Art</option>
                    <option value = "history">History</option>
                    <option value = "mythology">Mythology</option>
                    <option value = "sports">Sports</option>
                </select>

                <label htmlFor="difficulty">Difficulty: </label>
                <select value = {settings.questionDifficulty} id = "difficulty" onChange={(e) => {setSettings({...settings, questionDifficulty: e.target.value})}}>
                    <option value = "random">Random</option>
                    <option value = "easy">Easy</option>
                    <option value = "medium">Medium</option>
                    <option value = "hard">Hard</option>
                </select>


                <button onClick={newGame}>Start Game</button>

            </div>
        
        </>
    );
}


export default CreateQuiz;