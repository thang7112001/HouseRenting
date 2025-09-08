import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7777", // json-server chạy ở đây
});

export default api;
