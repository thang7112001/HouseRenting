import { useEffect, useState } from "react";
import { getProperties, createProperty, deleteProperty } from "../services/propertyService";

export default function AdminDashboard() {
    const [properties, setProperties] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [price, setPrice] = useState("");

    const loadData = () => {
        getProperties().then((res) => setProperties(res.data));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await createProperty({ name, description, address, price, status: "available", createdBy: "u1" });
        setName(""); setDescription(""); setAddress(""); setPrice("");
        loadData();
    };

    const handleDelete = async (id) => {
        await deleteProperty(id);
        loadData();
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Quản lý nhà cho thuê</h2>

            {/* Form thêm nhà */}
            <form onSubmit={handleAdd} className="bg-white shadow p-4 rounded mb-6 grid gap-2">
                <input className="border p-2 rounded" placeholder="Tên phòng" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="border p-2 rounded" placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input className="border p-2 rounded" placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input className="border p-2 rounded" placeholder="Giá thuê" value={price} onChange={(e) => setPrice(e.target.value)} />
                <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Thêm</button>
            </form>

            {/* Danh sách nhà */}
            <div className="grid gap-4">
                {properties.map((p) => (
                    <div key={p.id} className="bg-white shadow rounded p-4 flex justify-between">
                        <div>
                            <h3 className="font-bold">{p.name}</h3>
                            <p>{p.description}</p>
                            <p className="text-sm text-gray-500">{p.address}</p>
                        </div>
                        <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                            Xóa
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
