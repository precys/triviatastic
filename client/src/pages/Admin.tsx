import axios from "axios";
import { useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard/QuestionCard";

interface Question {
  questionId: string;
  question: string;
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
                />
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
