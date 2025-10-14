import axiosClient from "./axiosClient";

export async function getUserStats(userId: string) {
  try {
    console.log("userService.getUserStats called for userId:", userId);
    const res = await axiosClient.get(`/users/${userId}/stats`);
    console.log("userService.getUserStats response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching stats in userService:", err);
    throw err;
  }
}
