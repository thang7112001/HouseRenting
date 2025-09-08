import { useNavigate } from "react-router-dom";

export default function Header() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="bg-blue-600 text-white p-4 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">🏠 RentHouse App</h1>
                <nav className="space-x-4 flex items-center">
                    <a href="/" className="hover:underline">Trang chủ</a>
                    {!user && <a href="/login" className="hover:underline">Đăng nhập</a>}
                    {!user && <a href="/register" className="hover:underline">Đăng ký</a>}
                    {user && <a href="/contracts" className="hover:underline">Hợp đồng</a>}
                    {user && <a href="/profile" className="hover:underline">Hồ sơ</a>}
                    {user?.role === "admin" && (
                        <a href="/admin" className="hover:underline">Quản trị</a>
                    )}

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                            Đăng xuất
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
