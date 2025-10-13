import { QuestionInterface } from "../../types/question"

interface QuestionProps extends QuestionInterface {
  statusUpdate?: (questionId: string, status: string) => void,
  status?: string,
  username: string,
  questionId: string,
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
    status,
    username
}: QuestionProps) {
    
  return (
    <div className="card w-100">
        <div className="card-body">
            <h5 className="card-title">  {question} <span className="fs-6 fw-light">{status}</span> </h5> 
            <span className="fs-6"> ID: </span>  <span className="fs-6 fw-light"> {questionId} </span>
            <p className="card-text"> 
              <span className="fs-6"> Correct Answer: {correct_answer} </span>
              <br/>
              <span className="fs-6"> Incorrect Answers: {incorrect_answers.join(", ")} </span>
            </p>
            <div className="w-100 d-flex gap-4">
              <span className="fs-6"> by <span className="fs-6 fw-bold"> {username} </span></span>
              <span> {category} </span>
              <span> {type} </span>
              <span> {difficulty} </span>
            </div>
            {statusUpdate && (
              <div className="w-100 d-flex gap-2">
                <button className="btn btn-danger w-50" onClick={() => statusUpdate(questionId, "denied")}> 
                Deny 
                </button>
                <button className="btn btn-success w-50" onClick={() => statusUpdate(questionId, "approved")}> 
                Approve 
                </button>
              </div>
            )}
        </div>
    </div>
  )
}

export default QuestionCard