import { axiosClient } from "./axiosClient";


export const getDevisions = async () =>{
    const response = await axiosClient.get('/devision/get');
    return response;
}

export const addDevision = async (data) => {
    const response = await axiosClient.post('/devision/create', data);
    return response;
}

export const updateDevision = async (id, data) => {
    const response = await axiosClient.put(`/devision/update/${id}`, data);
    return response;
}

export const deleteDevision = async (id) => {
    const response = await axiosClient.delete(`/devision/delete/${id}`);
    return response;
}


