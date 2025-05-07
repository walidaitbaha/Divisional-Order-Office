import { axiosClient } from "./axiosClient"

export const getDesExp = async() =>{
    const response = await axiosClient.get("/exp_des/getExpDes");
    return response;
}

export const addExpDes = async(data) =>{
    const response = await axiosClient.post("/exp_des/createExpDes", data);
    return response;
}

export const updateExpDes = async(data,id) =>{
    const response = await axiosClient.put(`/exp_des/updateExpDes/${id}`, data);
    return response;
}

export const deleteExpDes = async(id) =>{
    const response = await axiosClient.delete(`/exp_des/deleteExpDes/${id}`);
    return response;
}
