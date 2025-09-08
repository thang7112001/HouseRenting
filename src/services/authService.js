import api from "./api";

export const login = async (username, password) => {
    const res = await api.get("/users");
    const user = res.data.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        return user;
    }
    throw new Error("Sai tài khoản hoặc mật khẩu");
};

export const register = async (data) => {
    data.role = "user";
    return api.post("/users", data);
};

export const logout = () => {
    localStorage.removeItem("user");
};
