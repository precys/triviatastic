import axios from "axios";
import { useEffect, useState } from "react";

interface Question {
  questionId: string;
  question: string;
  status: string;
  category: string;
  type: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: [];
}

function Admin() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNWNkNzVkNy1lOTI2LTQyYjctOTM0OS1lYmViNWEzYWJiNzAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTk3NTI3MDksImV4cCI6MTc1OTc5NTkwOX0.ap_Rp4gk0wIahMC3HtgOzNunUIMkSc9Sb7lTdlXZcqc";
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
      axios
        .get("http://localhost:3000/questions/status?status=pending", {
          headers: {
            Authorization: `Bearer ${token}` 
          },
      })
      .then((response) => {
        setQuestions(response.data.questions); 
      })
        .catch((err) => console.error(err));
  }, []);

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
      <div className="container margin-auto">
          <div className="row">
            <div className="col">
              <h2 className="text-center"> Pending Questions </h2>
              {questions.map((question) => (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title"> {question.category} </h5>
                    <p className="card-text"> 
                      <span> Question: {question.question} </span> 
                      <span> Correct Answer: {question.correct_answer} </span>
                      <span> Incorrect Answers: 
                        {question.incorrect_answers.map((incorrectAnswer) => (
                          <span> {incorrectAnswer}, </span>
                        ))} 
                      </span>
                    </p>
                    <button className="btn btn-primary" onClick={() => statusUpdate(question.questionId, "denied")}> 
                      Deny 
                    </button>
                    <button className="btn btn-primary" onClick={() => statusUpdate(question.questionId, "approved")}> 
                      Approve 
                    </button>
                  </div>
                </div>
              ))}


            </div>
            <div className="col">
              <h2 className="text-center"> Users </h2>
            </div>
          </div>
      </div>
    </>
  );
}

export default Admin;
