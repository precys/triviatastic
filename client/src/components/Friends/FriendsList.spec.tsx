import {render, screen} from "@testing-library/react"
import FriendsList from "./FriendsList"
import friendsService from "../../utils/friendsService";

jest.mock('../../utils/friendsService');

describe("FriendsList component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders friends list with more than one friend', async () => {
    (friendsService.getFriends as jest.Mock).mockResolvedValue({
      friends: ["patrick", "sandy"]
    });

    render(<FriendsList userId="aa6c3f6c-2da8-465d-aac3-17c6be3f91ee"/>);

    const header = await screen.findByText("Friends (2 friends)");
    expect(header).toBeInTheDocument();

    expect(await screen.findByText("patrick")).toBeInTheDocument();
    expect(await screen.findByText("sandy")).toBeInTheDocument();
  });

  test('renders friends list with one friend', async () => {
    (friendsService.getFriends as jest.Mock).mockResolvedValue({
      friends: ["pearlkrabs"]
    });

    render(<FriendsList userId="cd05ab52-bd4c-41ae-8ed8-72dcd0391bbf"/>);

    const header = await screen.findByText("Friends (1 friend)");
    expect(header).toBeInTheDocument();

    expect(await screen.findByText("pearlkrabs")).toBeInTheDocument();
  });

  test('renders friends list with no friends', async () => {
    (friendsService.getFriends as jest.Mock).mockResolvedValue({
      friends: []
    });

    render(<FriendsList userId="b6d9d2f5-2bf8-4fa5-9be3-80871709b434"/>);

    const header = await screen.findByText("Friends (0 friends)");
    expect(header).toBeInTheDocument();

    expect(await screen.findByText("No friends yet.")).toBeInTheDocument();
  });
});
