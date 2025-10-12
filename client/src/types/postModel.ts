import { CommentData } from './commentModel';

export interface PostData {
  postId: string;
  userId: string;
  username: string;
  content: string;
  likes?: number;
  liked?: boolean;
  userAvatar?: string;
  comments?: CommentData[];
  createdAt: string;
}
