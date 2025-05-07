import { axiosClient } from "./axiosClient"

export const getUsers = async (page = 1) =>{
    const response = await axiosClient.get(`/user/getUsers?page=${page}`);
    return response;
}

export const filterUsersByRole = async (role,page = 1) =>{
    const response = await axiosClient.get(`/user/filterUsersByRole/${role}?page=${page}`);
    return response;
}

export const updateUser = async (id,data) =>{
    const response = await axiosClient.put(`/user/updateUser/${id}`,data);
    return response;
}

export const deleteUser = async (id) =>{
    const response = await axiosClient.delete(`/user/deleteUser/${id}`);
    return response;
}
