function QuestionScreen({changeScreen, game}: QuestionScreenProps) {
    function answerQuestion(selection: number) {
        changeScreen();
    }
    return (
    <>
        <h1>Question #{}:</h1>
        <p>{}</p>
        <div>
            <button onClick={() => {answerQuestion(0)}}>A: {}</button>
            <button onClick={() => {answerQuestion(1)}}>B: {}</button>
            <button onClick={() => {answerQuestion(2)}}>C: {}</button>
            <button onClick={() => {answerQuestion(3)}}>D: {}</button>
        </div>
    </>
    );
}

type QuestionScreenProps = {
  changeScreen: () => void;
  game: object;
};

export default QuestionScreen;