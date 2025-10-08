import {render} from "@testing-library/react"
import Admin from "./Admin";

test(`renders PENDING`, () => {
    const {getByText} = render(<Admin />);

    const pendingText = getByText("PENDING:");

    expect(pendingText).toBeInTheDocument();
})