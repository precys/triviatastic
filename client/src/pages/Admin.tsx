import axios from "axios";
import { useEffect, useState } from "react";

interface Question {
  questionId: string;
  question: string;
  status: string;
  category: string;
  type: string;
  difficulty: string;
}

function Admin() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNWNkNzVkNy1lOTI2LTQyYjctOTM0OS1lYmViNWEzYWJiNzAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTk0OTkwMTEsImV4cCI6MTc1OTU0MjIxMX0.Us2jIwACPxZhiI9eAvw3hQY6aBVBNJ0OxX9OScQ7KI4";
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

  useEffect(()=> {
    console.log("QUESTIONS: ", JSON.stringify(questions));
  }, [questions])


  return (
    <>
      <div>
        <h1>PENDING:</h1>
        <ul>
          {questions.map((question) => (
            <li key={question.questionId}>
              {question.question} {question.status}
              <button> Approve </button>
              <button> Deny </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Admin;
