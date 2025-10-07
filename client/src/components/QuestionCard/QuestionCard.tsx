interface Question {
  questionId: string;
  question: string;
  category: string;
  type: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: [];
  statusUpdate: (questionId: string, status: string) => void;
}

function QuestionCard({
    questionId,
    question,
    category,
    type,
    difficulty,
    correct_answer,
    incorrect_answers,
    statusUpdate,
}: Question) {
    
  return (
    <div className="card">
        <div className="card-body">
            <h5 className="card-title"> {category} | {type} | {difficulty} </h5>
            <p className="card-text"> 
            <span> Question: {question} </span> 
            <br/>
            <span> Correct Answer: {correct_answer} </span>
            <br/>
            <span> Incorrect Answers: {incorrect_answers.join(", ")} </span>
            </p>
            <button className="btn btn-primary" onClick={() => statusUpdate(questionId, "denied")}> 
            Deny 
            </button>
            <button className="btn btn-primary" onClick={() => statusUpdate(questionId, "approved")}> 
            Approve 
            </button>
        </div>
    </div>
  )
}

export default QuestionCard