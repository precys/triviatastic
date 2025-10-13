import submitquestionService from '@/utils/submitquestionService';
import { useState } from 'react'
import { QuestionInterface } from '@/types/question'

function SubmitQuestion() {
    // initialize useStates
    const [question, setQuestion] = useState<QuestionInterface>({
        type: "multiple",
        difficulty: "",
        category: "",
        question: "",
        correct_answer: "",
        incorrect_answers: [],
    });
    const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>(["", "", ""])
    const [success, setSuccess] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>();

    const handleVisible = async () => {
        setVisible(false);
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await submitquestionService.createQuestion(question);
            if (res == 201){
                setSuccess(true);
            }
            else {
                setSuccess(false);
            }

            setVisible(true)
            console.log(visible)
            
        }
        catch (err){
            console.error(`Error creating question. ${err}`)
        }

    }

    const handleIncorrectAnswers = async (i: number, incorrectAnswer: string) => {
        setIncorrectAnswers((prev) => {
            const updated = [...prev];
            updated[i] = incorrectAnswer;
            return updated
        })
    }

    const handleTrueFalse = async (value: "True" | "False") => {
        setQuestion({ ...question, correct_answer: value, incorrect_answers: [value === "True" ? "False" : "True"]})
    }

    return (
        <>
            <div className="container-fluid vh-100">
                <div className="container margin-auto">
                    <div className="d-flex mt-4 gap-2">
                        <button
                            className={`btn ${question.type === "multiple" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setQuestion({ ...question, type: "multiple"})}
                        >
                            Multiple
                        </button>
                        <button
                            className={`btn ${question.type === "boolean" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setQuestion({ ...question, type: "boolean"})}
                        >
                            True/False
                        </button>
                    </div>
                    <div className="container w-75 mt-3">
                        <form className="row border p-3">
                            <div className="col-md-10">
                                <label className="form-label">Question: </label>
                                <input type="text" className="form-control" value={question.question} 
                                onChange={(e) => setQuestion({ ...question, question: e.target.value})} />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Category: </label>
                                <select className="form-control" value={question.category} onChange={(e) => setQuestion({...question, category: e.target.value})}>
                                    <option value="art">Art</option>
                                    <option value="history">History</option>
                                    <option value="mythology">Mythology</option>
                                    <option value="sports">Sports</option>
                                </select>
                            </div>
                            {question.type == "multiple" &&
                                <div>
                                    <div className="col-md-12">
                                        <label className="form-label">Correct Answer: </label>
                                        <input type="text" className="form-control" value={question.correct_answer} 
                                        onChange={(e) => setQuestion({ ...question, correct_answer: e.target.value})} />
                                    </div>
                                    <div className="col-md-12 d-flex flex-column gap-1">
                                        <label className="form-label">Incorrect Answers: </label>
                                        {incorrectAnswers.map((incorrectAnswer: string, i: number) => (
                                            <input key={i} type="text" className="form-control" placeholder={`Incorrect Answer #${i+1}`} 
                                            value={incorrectAnswer} onChange={(e) => handleIncorrectAnswers(i, e.target.value)} />
                                        ))} 
                                    </div>
                                </div>
                            }
                            {question.type == "boolean" &&
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <label className="form-label">True </label>
                                        <input className="form-check-input" type="radio" value="True" checked={question.correct_answer == "True"} 
                                        onChange={() => handleTrueFalse("True")} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">False </label>
                                        <input className="form-check-input" type="radio" value="False" checked={question.correct_answer == "False"} 
                                        onChange={() => handleTrueFalse("False")} />
                                    </div>
                                </div>
                            }
                            <button className="btn btn-primary w-100 mt-3" onClick={(e) => handleSubmit(e)}>Submit</button>
                            
                        </form>
                    </div>
                    {visible && 
                        <div className="modal d-block" tabIndex={-1}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{success ? "Success!" : "Failed"}</h5>
                                        <button type="button" className="btn-close" onClick={() => handleVisible()}></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>{success ? "Question was created!" : "Something went wrong."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default SubmitQuestion