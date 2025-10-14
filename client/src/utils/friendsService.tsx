import axiosClient from "./axiosClient";

async function getFriends(userId : string){
    const res = await axiosClient.get(`/users/${userId}/friends`);
    return res.data;
}

export default {
    getFriends
}