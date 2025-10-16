import { User } from "../../types/user";

interface UserProps extends User {
  handleModal: (args: {bool: boolean, userId?: string, questionId?: string, status?: string, suspend?: boolean}) => void,
}

function UserCard({
  username,
  userId,
  game_count,
  streak,
  category_counts,
  category_scores,
  hi_score,
  easy_count,
  med_count,
  hard_count,
  suspended,
  handleModal,
}: UserProps) {

  return (
    <div className="card w-100">
        <div className="card-body">
            <h5 className="card-title">  {username} <span className="fs-6 fw-lighter"> {userId} </span></h5>
            <div className="card-text"> 
              <div className="d-flex gap-3">
                <span className="fs-6">Games Played: {game_count}</span>
                [
                {Object.entries(category_counts).map(([category, count]) => (
                  <span key={category}> {category} Games: {count} </span>
                ))}]
              </div>
              <div className="d-flex gap-4">
                <span className="fs-6">Longest Streak: {streak}</span>
                <span className="fs-6">High Score: {hi_score}</span>
                <span className="fs-6">Easy: {easy_count}</span>
                <span className="fs-6">Medium: {med_count}</span>
                <span className="fs-6">Hard: {hard_count}</span>
              </div>
              <div className="d-flex gap-3">
                [
                  {Object.entries(category_scores).map(([category, score]) => (
                    <span key={category}> {category} Score: {score} </span>
                  ))}
                ]
              </div>
            </div>
            <span className="w-100 d-flex justify-content-end gap-1 mt-2">
              <button className="btn btn-danger w-25" onClick={() => handleModal({bool: true, userId, suspend: !suspended})}> 
                {suspended ? "Unsuspend" : "Suspend"}
              </button>
              <button className="btn btn-danger w-25" onClick={() => handleModal({bool: true, userId,})}> 
                Ban
              </button>
            </span>
        </div>
    </div>
  )
}

export default UserCard