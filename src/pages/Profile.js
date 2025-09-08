import UserProfileForm from "../components/UserProfileForm";

export default function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <p className="text-center p-6">Vui lòng đăng nhập để xem thông tin cá nhân.</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <UserProfileForm user={user} />
        </div>
    );
}
