import axiosClient from "./axiosClient";

async function login(username: string, password: string) {
    const body = {
        username,
        password,
    }
    const res = await axiosClient.post(`/users/login`, body);

    if (res.status == 201){
        return res.data;
    }
    else {
        return null;
    }
}

async function register(username: string, password: string) {
    const body = {
        username,
        password,
    }
    const res = await axiosClient.post(`/users/register`, body);
    if (res.status == 201){
        return res.data;
    }
    else {
        return null;
    }
}

async function getUsers(){
    const res = await axiosClient.get(`/users/`);
    return res.data
}

export default {
    login,
    register,
    getUsers,
}