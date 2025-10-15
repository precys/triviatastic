import { render, screen } from "@testing-library/react"
import Admin from "./Admin";
import { MemoryRouter } from "react-router-dom";
import Authentication from "../../components/Context/Authentication";
import adminService from "../../utils/adminService";
import userEvent from "@testing-library/user-event";

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
        mockedAdminService.getPendingQuestions.mockResolvedValueOnce({questions});

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
        mockedAdminService.getUsersStats.mockResolvedValueOnce(users)

        render(
            <Authentication>
                <MemoryRouter>
                    <Admin />
                </MemoryRouter>
            </Authentication>
        );
    })

    // Default behavior
    test(`Checks if default value of tab is questions`, async () => {
        const tabElement = await screen.findByText(`Pending Questions: 1`)
        expect(tabElement).toBeInTheDocument();
    })

    // Checks if cards rendered by defaults
    test("renders question card by default when Admin page loads", async () => {
        const questionCard = await screen.findByText("Sample question?");
        expect(questionCard).toBeInTheDocument();
    });

    // If tab for Users show up, make sure to check of user cards populate
    test("switches tab to 'users' and displays user cards", async () => {
        const usersTabButton = screen.getByRole("button", { name: /Users/i });
        await userEvent.click(usersTabButton);

        const userCard = await screen.findByText(/jestUser/i);
        expect(userCard).toBeInTheDocument();
    });
})