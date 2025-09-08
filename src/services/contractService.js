import api from "./api";
import axios from "axios";

const API_URL = "http://localhost:7777/contracts";

export const getContracts = () => api.get("/contracts");

export const getContractsByUser = (userId) =>
    api.get(`/contracts?userId=${userId}`);

export const createContract = (data) => api.post("/contracts", data);

export const updateContract = async (id, updates) => {
    const res = await axios.get(`${API_URL}/${id}`);
    const current = res.data;
    const updated = { ...current, ...updates };
    return axios.put(`${API_URL}/${id}`, updated);
};

export const deleteContract = (id) => api.delete(`/contracts/${id}`);
