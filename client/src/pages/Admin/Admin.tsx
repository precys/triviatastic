import adminService from "../../utils/adminService";
import { useEffect, useState } from "react";
import QuestionCard from "../../components/QuestionCard/QuestionCard";
import UserCard from "../../components/UserCard/UserCard"
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import { useNavigate } from "react-router-dom";
import { QuestionInterface } from "../../types/question";
import { User } from  "../../types/user";

interface Question extends QuestionInterface {
  username: string,
  questionId: string,
}

// Admin panel component
function Admin() {
  // useState for arraylist of questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<string>("questions");
  // Token is unpacked from AuthentificationHook
  const { token, logout } = AuthentificationHook();
  // navigate object to handle navigation after request, in this case if token is invalid go back to login
  const navigate = useNavigate();

  // useEffect to render on empty array list, page loading, to fill out questions
  useEffect(() => {
      const getPendingQuestions = async () => {
        try{
          const data = await adminService.getPendingQuestions()
          setQuestions(data.questions);
        }
        catch (err) {
          console.error(`Failed to get pending questions. ${err}`)
        }
      }
      
      getPendingQuestions();
  }, [token, navigate, logout]);

  // useEffefct to render on page load, filling up users with their stats
    useEffect(() => {
      const getUsersStats = async () => {
        try {
          const data = await adminService.getUsersStats();
          setUsers(data);
        }
        catch (err) {
          console.error(`Failed to get users states. ${err}`)
        }
      }

      getUsersStats();
  }, [token, navigate, logout]);


  // statusUpdate function that sends request to statusUpdate endpoint for approval or denial
  const statusUpdate = async (questionId: string, newStatus: string) => {
    try {
      const res = await adminService.updateQuestionStatus(questionId, newStatus)
      console.log(res)
      
      setQuestions((prev) =>
          prev.filter((question) => question.questionId !== questionId)
        );
    }
    catch (err) {
      console.error(`Error updating question ${questionId} to ${newStatus}. Error: ${err}`)
    }
  }

  // deleteUser function to delete user given an user Id
  const deleteUser = async (userId: string) => {
    try {
      const res = await adminService.deleteUser(userId)
      console.log(res);

      setUsers((prev) =>
        prev.filter((user) => user.userId !== userId)
      );
    }
    catch (err) {
      console.error(`Error deleting user. Error: ${err}`)
    }
  }

  return (
    <>
      <div className="container-fluid vh-100">
        <div className="container margin-auto">
        <div className="d-flex mt-4 gap-2">
          <button
            className={`btn ${tab === "questions" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTab("questions")}
          >
            Questions
          </button>
          <button
            className={`btn ${tab === "users" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTab("users")}
          >
            Users
          </button>
        </div>
        <div className="container w-75 pt-5">
            {tab == "questions" && 
                <div>
                  <h2 className="align-baseline"> Pending Questions: {questions.length} </h2>
                  <div className="d-flex flex-column gap-2 just-content-center">
                    {questions.map((question) => (
                      <QuestionCard
                        key={question.questionId}
                        questionId={question.questionId}
                        category={question.category}
                        question={question.question}
                        type={question.type}
                        difficulty={question.difficulty}
                        correct_answer={question.correct_answer}
                        incorrect_answers={question.incorrect_answers}
                        statusUpdate={statusUpdate}
                        username={question.username || "banned user"}
                      />
                    ))}
                  </div>
                </div>
            }
            {tab == "users" && 
                <div>
                  <h2 className="align-baseline"> Users </h2>
                  <div className="d-flex flex-column gap-2 just-content-center">
                    {users.map((user) => (
                      <UserCard
                        key={user.userId}
                        username={user.username}
                        userId={user.userId}
                        game_count={user.game_count}
                        streak={user.streak}
                        category_counts={user.category_counts}
                        category_scores={user.category_scores}
                        hi_score={user.hi_score}
                        easy_count={user.easy_count}
                        med_count={user.med_count}
                        hard_count={user.hard_count}
                        deleteUser={deleteUser}
                      />
                    ))}
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
