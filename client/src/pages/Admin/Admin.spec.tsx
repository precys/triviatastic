import { render, screen } from "@testing-library/react"
import Admin from "./Admin";
import { MemoryRouter } from "react-router-dom";
import Authentication from "../../components/Context/Authentication";
import adminService from "@/utils/adminService";

jest.mock("../../utils/adminService.tsx")
const mockedAdminService = adminService as jest.Mocked<typeof adminService>;

describe("Test for Admin page", () => {
    // Setup each test with rendering of router and context, also needs questions array list and users array list
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup useEffect returned values from endpoints
        const questions = [{
            questionId: "1",
            username: "testuser",
            category: "General",
            question: "Sample question?",
            type: "boolean",
            difficulty: "easy",
            correct_answer: "True",
            incorrect_answers: ["False"], 
        }]
        mockedAdminService.getPendingQuestions.mockResolvedValueOnce({questions: questions});

        const users = [{
            username: "jestUser",
            userId: "1",
            game_count: 0,
            streak: 0,
            category_counts: { art: 0, history: 0, mythology: 0, sports: 0, any: 0 },
            category_scores: { art: 0, history: 0, mythology: 0, sports: 0, any: 0 },
            hi_score: 0,
            easy_count: 0,
            med_count: 0,
            hard_count: 0,
        }]
        mockedAdminService.getUsersStats.mockResolvedValueOnce({users: users})

        render(
            <Authentication>
                <MemoryRouter>
                    <Admin />
                </MemoryRouter>
            </Authentication>
        );
    })

    // Default behavior
    test(`Checks if default value of tab is questions`, () => {
        // const tabElement = screen.getBy

    })

    // Checks if P
    test("renders PENDING", () => {
        const pendingText = screen.getByText("PENDING:");
        expect(pendingText).toBeInTheDocument();
  });

})