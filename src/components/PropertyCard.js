import { deleteProperty, updateProperty } from "../services/propertyService";
import { useState } from "react";
import { createContract } from "../services/contractService";

export default function PropertyCard({ property, onDeleted, onUpdated }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...property });

    const handleRent = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để thuê phòng");
            return;
        }
        if (property.status !== "available") {
            alert("Phòng hiện không còn trống");
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
            alert("Đã gửi yêu cầu thuê. Chờ admin duyệt.");
        } catch (err) {
            alert("Thuê thất bại ❌");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Bạn có chắc muốn xóa phòng này?")) {
            await deleteProperty(property.id);
            onDeleted && onDeleted(property.id);
        }
    };

    const handleSave = async () => {
        try {
            await updateProperty(property.id, formData);
            setIsEditing(false);
            onUpdated && onUpdated(formData);
        } catch (err) {
            alert("Cập nhật thất bại ❌");
        }
    };

    const handleCancel = () => {
        setFormData({ ...property });
        setIsEditing(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <textarea
                        className="border p-2 rounded"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={formData.address}
                        onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                        }
                    />
                    <input
                        type="number"
                        className="border p-2 rounded"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData({ ...formData, price: Number(e.target.value) })
                        }
                    />
                    <select
                        className="border p-2 rounded"
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                        }
                    >
                        <option value="available">Còn trống</option>
                        <option value="rented">Đã thuê</option>
                        <option value="maintenance">Đang sửa chữa</option>
                    </select>

                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                    </div>
                </>
            ) : (
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
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Xóa
                            </button>
                        </div>
                    )}
                    {user && user.role === "user" && property.status === "available" && (
                        <button
                            onClick={handleRent}
                            className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                        >
                            Thuê
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
