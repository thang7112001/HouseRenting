import { useState } from "react";
import { updateUser } from "../services/userService";

export default function UserProfileForm({ user, onUpdated }) {
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState(user.password);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = { ...user, name, password };
            await updateUser(user.id, updatedUser);

            localStorage.setItem("user", JSON.stringify(updatedUser));

            setMessage("Cập nhật thành công ✅");
            if (onUpdated) onUpdated(updatedUser);
        } catch (err) {
            setMessage("Có lỗi xảy ra ❌");
        }
    };

    return (
        <div className="bg-white shadow rounded p-6 w-96 mx-auto">
            <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
            {message && <p className="text-green-600 mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Lưu thay đổi
                </button>
            </form>
        </div>
    );
}
