// NewHeader.js

import { useNavigate, useLocation } from "react-router-dom";
import PillNav from "../AnimationComponent/PillNav"; // Đảm bảo đường dẫn chính xác
import logo from "../utils/air-bnb3.jpg";   // Thay thế bằng logo của bạn

export default function NewHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };
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
            { label: "Hồ sơ", href: "/profile" },
            { label: "Thanh toán", href: "/payments"}
        );
        if (user.role === "admin") {
            navItems.push({ label: "Quản trị", href: "/admin" });
        }
    }

    return (
        <header className="w-full flex justify-center items-center p-4 relative bg-[#246BCE]">
            <div className="container mx-auto flex justify-between items-center">
                <PillNav
                    logo={logo}
                    items={navItems}
                    activeHref={location.pathname}
                    baseColor="#89CFF0"
                    pillColor="#1F305E"
                    hoveredPillTextColor="#1F305E"
                    pillTextColor="#89CFF0"
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