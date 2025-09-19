import { useEffect, useState, useCallback } from "react";
import { getContracts, getContractsByUser, updateContract, deleteContract } from "../services/contractService";
import { getPropertyById, updateProperty } from "../services/propertyService";
import ContractCard from "../components/ContractCard";

export default function Contracts() {
    const [contracts, setContracts] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    const loadContracts = useCallback(() => {
        if (user) {
            if (user.role === "admin") {
                getContracts().then((res) => setContracts(res.data));
            } else {
                getContractsByUser(user.id).then((res) => setContracts(res.data));
            }
        }
    }, [user]);

    useEffect(() => {
        loadContracts();
    }, [loadContracts]);

    const handleApprove = async (id) => {
        await updateContract(id, { status: "active" });
        try {
            const all = await getContracts();
            const approved = all.data.find((c) => c.id === id);
            if (approved?.propertyId) {
                const propRes = await getPropertyById(approved.propertyId);
                const property = propRes.data;
                if (property.status !== "rented") {
                    await updateProperty(property.id, { ...property, status: "rented" });
                }
            }
        } catch (e) {
            // best-effort: ignore
        }
        loadContracts();
    };

    const handleReject = async (id) => {
        await updateContract(id, { status: "available" });
        await deleteContract(id);
        loadContracts();
    };

    const handleDelete = async (id) => {
        const target = contracts.find((c) => c.id === id);
        if (!target) return;
        if (target.status === "active") {
            alert("Hợp đồng đã duyệt không thể xóa");
            return;
        }
        if (!window.confirm("Bạn có chắc muốn xóa hợp đồng này?")) return;
        await deleteContract(id);
        loadContracts();
    };

    if (!user) {
        return <p className="text-center p-6">Vui lòng đăng nhập để xem hợp đồng.</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">
                {user.role === "admin" ? "Tất cả hợp đồng" : "Hợp đồng của tôi"}
            </h2>
            {contracts.length === 0 ? (
                <p>Chưa có hợp đồng nào.</p>
            ) : (
                <div className="grid gap-4">
                    {contracts.map((c) => (
                        <ContractCard
                            key={c.id}
                            contract={c}
                            user={user}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
