import { useEffect, useState, useCallback } from "react";
import { getContracts, getContractsByUser, updateContract } from "../services/contractService";
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
        loadContracts();
    };

    const handleReject = async (id) => {
        await updateContract(id, { status: "cancelled" });
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
