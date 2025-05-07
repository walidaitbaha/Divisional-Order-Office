import { axiosClient } from "./axiosClient"

export const getMessages = async(page = 1) => {
    const response = await axiosClient.get(`/message/getMessageOfDevision?page=${page}`)
    return response
}

export const getMessagesofDevision = async() => {
    const response = await axiosClient.get(`/message/getMessageOfDevisions`)
    return response
}

export const addMessages = async(data) => {
    const response = await axiosClient.post("/message/store",data,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
    return response
}

export const updateMessage = async (id, formData) => {
    const response = await axiosClient.post(`message/update/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response;
}

export const deleteMessage = async (id) => {
    const response = await axiosClient.delete(`message/delete/${id}`);
    return response;
}

export const getMessageDeleted = async (page = 1) => {
    const response = await axiosClient.get(`/message/softdelete?page=${page}`)
    return response
}