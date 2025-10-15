// Placeholder import for Leaderboard component
import Leaderboard from "@/components/Leaderboard/Leaderboard"
import CreateQuiz from "../../components/CreateQuiz/CreateQuiz"

function Home() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Leaderboard />
        <CreateQuiz/>
      </div>
    </>
  )
}

export default Home