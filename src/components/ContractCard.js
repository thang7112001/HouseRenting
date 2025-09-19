export default function ContractCard({ contract, user, onApprove, onReject, onDelete }) {
    return (
        <div className="bg-white shadow rounded p-4">
            <p><strong>Mã hợp đồng:</strong> {contract.id}</p>
            <p><strong>User:</strong> {contract.userId}</p>
            <p><strong>Phòng:</strong> {contract.propertyId}</p>
            <p><strong>Bắt đầu:</strong> {contract.startDate}</p>
            <p><strong>Trạng thái:</strong> {contract.status}</p>
            <p>
                <strong>Thanh toán hàng tháng:</strong>{" "}
                {contract.monthlyPayment
                    ? contract.monthlyPayment.toLocaleString() + " VNĐ"
                    : "Chưa có thông tin"}
            </p>

            {user?.role === "admin" && contract.status === "pending" && (
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => onApprove(contract.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                        Duyệt
                    </button>
                    <button
                        onClick={() => onReject(contract.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                        Từ chối
                    </button>
                </div>
            )}

            {user?.role === "user" && contract.status !== "active" && (
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => onDelete && onDelete(contract.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                        Xóa
                    </button>
                </div>
            )}
        </div>
    );
}
