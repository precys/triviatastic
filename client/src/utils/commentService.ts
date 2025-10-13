import axiosClient from "./axiosClient";

// fetch user's own posts
async function getPosts(userId: string) {
  const res = await axiosClient.get(`/posts/${userId}/posts`);
  return res.data;
}

// fetch friends' posts (if applicable later)
async function getFriendsPosts(userId: string) {
  const res = await axiosClient.get(`/posts/${userId}/friends/posts`);
  return res.data;
}

// fetch recent 20 posts from all users (future)
async function getRecentPosts() {
  const res = await axiosClient.get(`/posts/feed`);
  return res.data;
}

// add a post
// async function addPost(userId: string, content: string) {
async function addPost(userId: string, body: {content: string, profileId?: string}) {
  const res = await axiosClient.post(`/posts/${userId}/posts`, body);
  return res.data;
}

// add new comment to a post
async function addComment(userId: string, postId: string, content: string) {
  const res = await axiosClient.post(`/posts/${userId}/posts/${postId}/comments`, { content });
  return res.data;
}

// toggle like on a post
async function toggleLike(userId: string, postId: string) {
  const res = await axiosClient.post(`/posts/${userId}/posts/${postId}/like`);
  return res.data;
}

export default {
  getPosts,
  getFriendsPosts,
  getRecentPosts,
  addComment,
  toggleLike,
  addPost,
};
