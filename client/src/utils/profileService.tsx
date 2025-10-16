import axiosClient from "./axiosClient";

async function deleteProfile(userId: string){
    const res = await axiosClient.delete(`/users/${userId}`)
    return res.status
}

export default {
    deleteProfile,
}