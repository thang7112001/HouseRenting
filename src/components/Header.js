// NewHeader.js

import { useNavigate, useLocation } from "react-router-dom";
import PillNav from "../AnimationComponent/PillNav"; // Đảm bảo đường dẫn chính xác
import logo from "../utils/home-logo.jpg";   // Thay thế bằng logo của bạn

export default function NewHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // --- Xây dựng danh sách items động ---
    // Phần tử đầu tiên ('Trang chủ') sẽ được dùng cho cả link logo và mục menu đầu tiên.
    let navItems = [
        { label: "Trang chủ", href: "/" },
    ];

    if (!user) {
        navItems.push(
            { label: "Đăng nhập", href: "/login" },
            { label: "Đăng ký", href: "/register" }
        );
    } else {
        navItems.push(
            { label: "Hợp đồng", href: "/contracts" },
            { label: "Hồ sơ", href: "/profile" }
        );
        if (user.role === "admin") {
            navItems.push({ label: "Quản trị", href: "/admin" });
        }
    }

    return (
        <header className="w-full flex justify-center items-center p-4 relative">
            <div className="container mx-auto flex justify-between items-center">
                <PillNav
                    logo={logo}
                    items={navItems}
                    activeHref={location.pathname}
                    baseColor="#000000"
                    pillColor="#ffffff"
                    hoveredPillTextColor="#ffffff"
                    pillTextColor="#000000"
                />

                {user && (
                    <button
                        onClick={handleLogout}
                        className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
                    >
                        Đăng xuất
                    </button>
                )}
            </div>
        </header>
    );
}