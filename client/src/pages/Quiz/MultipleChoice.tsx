
function MultipleChoice({answerQuestion, answers}: MultipleChoiceProps) {
    let characterCode: number = "A".charCodeAt(0);
    return(
        <div className="mt-auto">
            {
                answers.map((answer, i) => {
                    return(
                        <div className="container-fluid p-3" >
                            <button className="btn btn-primary btn-lg btn-block col-12 p-4" onClick={() => answerQuestion(answer)}>{String.fromCharCode(characterCode+i)}: {format(answer)}</button>
                        </div>
                    )
                })
            }
        </div>
    );
}
function format(input: String) : String {
    return input.replaceAll("&#039;", "\'").replaceAll("&rsquo;", "\'").replaceAll('&quot;', '\"').replaceAll("&amp;", "&");
}

type MultipleChoiceProps = {
  answerQuestion: (selection: string) => void;
  answers: Array<string>;
};

export default MultipleChoice;