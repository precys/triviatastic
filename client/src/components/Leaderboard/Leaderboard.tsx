import leaderboardService from '@/utils/leaderboardService';
import { useEffect, useState} from 'react'
import AuthentificationHook from '../Context/AuthentificationHook';

// Initialize interface for usersScore object
interface usersScore {
    username: string,
    userId: string,
    category_score: number,
}

// Leaderboard component to display user high scores per category
function Leaderboard() {
    // initialize useState variables
    const [usersScore, setUsersScore] = useState<usersScore[]>([]);
    const [category, setCategory] = useState<string>("any");
    // unpack token, base url from context
    const { token } = AuthentificationHook();
    // initialize endpoints leaderboard needs
    const endpoint = `/users/leaderboard?category=${category}`

    // useEffect to grab/update usersScore
    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                const res = await leaderboardService.getLeaderboard(category)
                setUsersScore(res.users_score)
            }
            catch (err){
                console.error(`Error: ${err}`)
            }
        }

        getLeaderboard();
    }, [category, token, endpoint])


    return (
        <>
            <div className="p-5">
                <table className="table">
                    <thead>
                        <tr>
                            <td> Ranking </td>
                            <td> User </td>
                            <td> 
                                <label> Category: </label>
                                <select className="ms-1" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="any">Any</option>
                                    <option value="art">Art</option>
                                    <option value="history">History</option>
                                    <option value="mythology">Mythology</option>
                                    <option value="sports">Sports</option>
                                </select>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {usersScore.map((user, index) => (
                            <tr key={index + 1}>
                                <th scope="row"> {index + 1} </th>
                                <td> {user.username} </td>
                                <td> {user.category_score} </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Leaderboard