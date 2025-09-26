import { deleteProperty, updateProperty } from "../services/propertyService";
import { useState } from "react";
import { createContract } from "../services/contractService";
import AddEditModal from "./AddEditModal";
import ComfirmModal from "./ConfirmModal";
import { Link } from "react-router-dom";

export default function PropertyCard({ property, onDeleted, onUpdated }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...property });
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmRentOpen, setConfirmRentOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoTitle, setInfoTitle] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

    const images = Array.isArray(property.images) ? property.images : [];
    const cover = images.length > 0 ? images[0] : null;

    const handleRent = async () => {
        if (!user) {
            setInfoTitle("Thông báo");
            setInfoMessage("Vui lòng đăng nhập để thuê phòng");
            setInfoOpen(true);
            return;
        }
        if (property.status !== "available") {
            setInfoTitle("Thông báo");
            setInfoMessage("Phòng hiện không còn trống");
            setInfoOpen(true);
            return;
        }
        try {
            const newContract = {
                userId: user.id,
                propertyId: property.id,
                startDate: new Date().toISOString().slice(0, 10),
                status: "pending",
                price: property.price,
            };
            await createContract(newContract);
            onUpdated && onUpdated();
            setInfoTitle("Thành công");
            setInfoMessage("Đã gửi yêu cầu thuê. Chờ admin duyệt.");
            setInfoOpen(true);
        } catch (err) {
            setInfoTitle("Lỗi");
            setInfoMessage("Thuê thất bại ❌");
            setInfoOpen(true);
        }
    };

    const handleDelete = async () => {
        await deleteProperty(property.id);
        onDeleted && onDeleted(property.id);
    };

    const handleSave = async () => {
        try {
            await updateProperty(property.id, formData);
            setIsEditing(false);
            onUpdated && onUpdated(formData);
        } catch (err) {
            setInfoTitle("Lỗi");
            setInfoMessage("Cập nhật thất bại ❌");
            setInfoOpen(true);
        }
    };

    const handleCancel = () => {
        setFormData({ ...property });
        setIsEditing(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2">
            <div className="w-full h-40 bg-gray-100 rounded overflow-hidden">
                {cover ? (
                    <img src={cover} alt={property.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Chưa có hình
                    </div>
                )}
            </div>
            {!isEditing ? (
                <>
                    <h2 className="text-lg font-bold">{property.name}</h2>
                    <p className="text-gray-600">{property.description}</p>
                    <p className="text-sm text-gray-500">{property.address}</p>
                    <p className="text-blue-600 font-semibold">
                        {property.price.toLocaleString()} VNĐ/tháng
                    </p>
                    <p
                        className={`text-sm ${
                            property.status === "available"
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {property.status === "available" ? "Còn trống" : "Đã thuê"}
                    </p>

                    {user?.role === "admin" && (
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => setConfirmDeleteOpen(true)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Xóa
                            </button>
                        </div>
                    )}
                    {user && user.role === "user" && (
                        <div className="mt-2 flex items-center gap-2">
                            {property.status === "available" && (
                                <button
                                    onClick={() => setConfirmRentOpen(true)}
                                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:rounded-xl w-32"
                                >
                                    Thuê
                                </button>
                            )}
                            <Link
                                to={`/property/${property.id}`}
                                className="bg-gray-200 text-gray-900 px-3 py-1 rounded hover:rounded-xl w-32 text-center"
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    )}
                </>
            ) : null}

            <AddEditModal
                open={isEditing}
                title="Chỉnh sửa phòng"
                submitText="Lưu"
                cancelText="Hủy"
                onSubmit={handleSave}
                onCancel={handleCancel}
            >
                <input
                    type="text"
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Tên phòng"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <textarea
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Mô tả"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <input
                    type="text"
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Địa chỉ"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <input
                    type="number"
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Giá"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
                <select
                    className="border p-2 rounded w-full"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value="available">Còn trống</option>
                    <option value="rented">Đã thuê</option>
                    <option value="maintenance">Đang sửa chữa</option>
                </select>
            </AddEditModal>

            <ComfirmModal
                open={confirmDeleteOpen}
                title="Xóa phòng"
                message={`Bạn có chắc muốn xóa "${property.name}"?`}
                confirmText="Xóa"
                onConfirm={() => { 
                    setConfirmDeleteOpen(false); 
                    handleDelete(); 
                }}
                onCancel={() => setConfirmDeleteOpen(false)}
            />

            <ComfirmModal
                open={confirmRentOpen}
                title="Xác nhận thuê"
                message={`Bạn chắc chắn thuê phòng "${property.name}"?`}
                confirmText="Thuê"
                onConfirm={() => { 
                    setConfirmRentOpen(false); 
                    handleRent(); 
                }}
                onCancel={() => setConfirmRentOpen(false)}
            />

            <ComfirmModal
                open={infoOpen}
                title={infoTitle}
                message={infoMessage}
                confirmText="Đóng"
                showCancel={false}
                onConfirm={() => setInfoOpen(false)}
            />
            
        </div>
    );
}
