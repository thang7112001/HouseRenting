import { useEffect, useState } from "react";
import { getProperties, createProperty, deleteProperty } from "../services/propertyService";
import AddEditModal from "../components/AddEditModal";
import ComfirmModal from "../components/ConfirmModal";

export default function AdminDashboard() {
    const [properties, setProperties] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [price, setPrice] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const loadData = () => {
        getProperties().then((res) => setProperties(res.data));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async () => {
        await createProperty({ name, description, address, price, status: "available", createdBy: "u1" });
        setName(""); setDescription(""); setAddress(""); setPrice("");
        setAddOpen(false);
        loadData();
    };

    const handleDelete = async (id) => {
        await deleteProperty(id);
        loadData();
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Quản lý nhà cho thuê</h2>

            <button onClick={() => setAddOpen(true)} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mb-6">Thêm nhà</button>

            <AddEditModal
                open={addOpen}
                title="Thêm nhà cho thuê"
                submitText="Thêm"
                cancelText="Hủy"
                onSubmit={handleAdd}
                onCancel={() => setAddOpen(false)}
            >
                <input className="border p-2 rounded w-full mb-2" placeholder="Tên phòng" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="border p-2 rounded w-full mb-2" placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input className="border p-2 rounded w-full mb-2" placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input className="border p-2 rounded w-full" placeholder="Giá thuê" value={price} onChange={(e) => setPrice(e.target.value)} />
            </AddEditModal>

            {/* Danh sách nhà */}
            <div className="grid gap-4">
                {properties.map((p) => (
                    <div key={p.id} className="bg-white shadow rounded p-4 flex justify-between">
                        <div>
                            <h3 className="font-bold">{p.name}</h3>
                            <p>{p.description}</p>
                            <p className="text-sm text-gray-500">{p.address}</p>
                        </div>
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" 
                          onClick={() => { 
                            setDeleteId(p.id); 
                            setDeleteOpen(true); 
                            }} 
                        >
                            Xóa
                        </button>
                    </div>
                ))}
            </div>

            <ComfirmModal
                open={deleteOpen}
                title="Xóa nhà"
                message="Bạn có chắc chắn muốn xóa nhà này?"
                confirmText="Xóa"
                onConfirm={async () => { 
                    setDeleteOpen(false); 
                    if (deleteId) await handleDelete(deleteId); 
                    setDeleteId(null); 
                }}
                onCancel={() => { 
                    setDeleteOpen(false); 
                    setDeleteId(null); 
                }}
            />
        </div>
    );
}
