export interface CommentData {
  commentId: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  likes: number;
  liked: boolean;
  createdAt: string;
  userAvatar?: string;
  replies?: CommentData[];
}
