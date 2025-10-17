import adminService from "../../utils/adminService";
import { useEffect, useState } from "react";
import QuestionCard from "../../components/QuestionCard/QuestionCard";
import UserCard from "../../components/UserCard/UserCard"
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import { QuestionInterface } from "../../types/question";
import { User } from  "../../types/user";

interface Question extends QuestionInterface {
  username: string,
  questionId: string,
  status?: string,
}

// Admin panel component
function Admin() {
  // useState for arraylist of questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<string>("questions");
  // Token is unpacked from AuthentificationHook
  const { token, delUsers } = AuthentificationHook();
  // navigate object to handle navigation after request, in this case if token is invalid go back to login
  const [modalBool, setModalBool] = useState<boolean>(false);
  const [suspend, setSuspend] = useState<boolean | null>();
  const [status, setStatus] = useState<string | null>("")
  const [userId, setUserId] = useState<string | null>("")
  const [questionId, setQuestionId] = useState<string | null>("")

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
  }, [token]);
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
  }, [token]);

  // statusUpdate function that sends request to statusUpdate endpoint for approval or denial
  const statusUpdate = async (questionId: string, newStatus: string) => {
    try {
      await adminService.updateQuestionStatus(questionId, newStatus)
      
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
      await adminService.deleteUser(userId)

      setUsers((prev) =>
        prev.filter((user) => user.userId !== userId)
      );
      delUsers(userId)
    }
    catch (err) {
      console.error(`Error deleting user. Error: ${err}`)
    }
  }

  // bool function for modal
  const handleModal = async (args: {bool: boolean, userId?: string, questionId?: string, status?: string, suspend?: boolean}) => {
    const { bool, userId, questionId, status, suspend } = args;

    setModalBool(bool);
    if (userId){
      setUserId(userId)
    }
    if (questionId){
      setQuestionId(questionId)
    }
    if (status){
      setStatus(status)
    }
    if (suspend !== undefined && suspend !== null){
      setSuspend(suspend)
    }
  }

  // function to update user's suspension
  const handleSuspend = async (userId: string, suspend: boolean) => {
    try {
      const res = await adminService.updateUserSuspend(userId, suspend)
      const userSuspendBool = res.user.Attributes.suspended
      

      setUsers(prev =>
        prev.map(user =>
          user.userId === userId ? { ...user, suspended: userSuspendBool } : user
      )
      );
    }
    catch (err){
      console.error(`Error updating user suspension. ${err}`)
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
                        status={question.status}
                        username={question.username ?? "Banned User"}
                        handleModal={handleModal}
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
                        suspended={Boolean(user.suspended)}
                        handleModal={handleModal}
                      />
                    ))}
                  </div>
                </div>
              }
          </div>
        </div>
      </div>
      {modalBool && 
          <div className="modal d-block" tabIndex={-1}>
              <div className="modal-dialog">
                  <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          Are you sure you want to{" "}
                          {tab === "questions"
                            ? status === "approved"
                              ? "approve"
                              : "deny"
                            : suspend === true
                              ? "suspend"
                              : suspend === false
                                ? "unsuspend"
                                : "delete"}{" "}
                          this {tab === "questions" ? "question" : "user"}?
                        </h5>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleModal({bool: false})}> No </button>
                        <button type="button" className="btn btn-danger" onClick={() => {
                          if (tab === "questions" && status && questionId){
                            statusUpdate(questionId, status)
                          }
                          else if (tab === "users" && userId){
                            if (suspend != null){
                              handleSuspend(userId, suspend)
                            }
                            else{
                              deleteUser(userId)
                            }
                          }
                          setModalBool(false)
                          setStatus(null)
                          setQuestionId(null)
                          setUserId(null)
                          setSuspend(null)
                        }}> Yes </button>
                      </div>
                  </div>
              </div>
          </div>
        }
    </>
  );
}

export default Admin;
