
function MultipleChoice({answerQuestion, answers}: MultipleChoiceProps) {
    let characterCode: number = "A".charCodeAt(0);
    return(
        <div>
            {answers.map((answer, i) => <button onClick={() => answerQuestion(answer)}>{String.fromCharCode(characterCode+i)}: {answer}</button>)}
        </div>
    );
}

type MultipleChoiceProps = {
  answerQuestion: (selection: string) => void;
  answers: Array<string>;
};

export default MultipleChoice;