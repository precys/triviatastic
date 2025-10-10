import axios from "axios";
import { useEffect, useState } from "react";
import QuestionCard from "../../components/QuestionCard/QuestionCard";
import AuthentificationHook from "../../components/Context/AuthentificationHook";
import { useNavigate } from "react-router-dom";

// Setting up TypeScript interface for question object made
interface Question {
  questionId: string;
  question: string;
  category: string;
  type: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: [];
  username: string;
}

// Admin panel component
function Admin() {
  // useState for arraylist of questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tab, setTab] = useState<string>("questions");
  // Token is unpacked from AuthentificationHook
  const { token, logout } = AuthentificationHook();
  // navigate object to handle navigation after request, in this case if token is invalid go back to login
  const navigate = useNavigate();

  // useEffect to render on empty array list, page loading, to fill out questions
  useEffect(() => {
      axios
        // Endpoint to change status
        .get("http://localhost:3000/questions/status?status=pending", {
          headers: {
            Authorization: `Bearer ${token}` 
          },
      })
        // Parse through body for questions
        .then((response) => {
          setQuestions(response.data.questions); 
        })
        // Error handling
        .catch((err) =>{
          console.error(err)
            // Since we return a 401 from our JWT in server, logout erases token and navigate back to login
            if (err.response.status==401){
              logout()
              navigate("/")
            }
        } );
  }, [token, navigate, logout]);

  // statusUpdate function that sends request to statusUpdate endpoint for approval or denial
  const statusUpdate = async (questionId: string, newStatus: string) => {
    try {
      const url = `http://localhost:3000/questions/${questionId}?status=${newStatus}`
      await axios
        .patch(url,
          {},
          {
          headers: {
            Authorization: `Bearer ${token}` 
          },
        })
        .then((response) => {
          console.log(response)
        })
        .catch((err) => console.error(err))

        // Filters current arraylist to not include question that was changed.
        setQuestions((prev) =>
          prev.filter((question) => question.questionId !== questionId)
        );
    }
    catch (err) {
      console.error(`Error updating question ${questionId} to ${newStatus}. Error: ${err}`)
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
          {tab == "questions" && 
            <div className="container w-75  pt-5">
              <h2 className="align-baseline"> Pending Questions: {questions.length} </h2>
              <div className="d-flex just-content-center">
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
                    username={question.username}
                  />
                ))}
              </div>
            </div>
          }
          {/* {tab == "users" &&
          } */}
        </div>
      </div>
    </>
  );
}

export default Admin;
