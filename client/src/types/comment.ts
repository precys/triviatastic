export interface CommentData {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  likes: number;
  liked: boolean;
  replies: CommentData[];
}
