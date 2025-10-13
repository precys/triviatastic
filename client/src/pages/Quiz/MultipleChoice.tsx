
function MultipleChoice({answerQuestion, answers}: MultipleChoiceProps) {
    let characterCode: number = "A".charCodeAt(0);
    return(
        <div className="mt-auto">
            {
                answers.map((answer, i) => {
                    return(
                        <div className="container-fluid p-3" >
                            <button className="btn btn-primary btn-lg btn-block col-12 p-4" onClick={() => answerQuestion(answer)}>{String.fromCharCode(characterCode+i)}: {answer}</button>
                        </div>
                    )
                })
            }
        </div>
    );
}

type MultipleChoiceProps = {
  answerQuestion: (selection: string) => void;
  answers: Array<string>;
};

export default MultipleChoice;