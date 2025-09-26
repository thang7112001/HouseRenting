import { useEffect, useState,useCallback } from "react";
import { getContracts,updateContract } from "../services/contractService";
import { Link } from "react-router-dom";
import ConfirmModal from '../components/ConfirmModal'

export default function PaymentHistory() {
  const [contracts, setContracts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [monthInput,setMonthInput] = useState({});
  const [infoOpen, setInfoOpen] = useState(false);
    const [infoTitle, setInfoTitle] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

  const loadContracts =useCallback( () => {
    if (user) {
      if (user.role === "admin") {
        getContracts().then((res) => setContracts(res.data.filter((c) => c.status === 'active')));
      } else {
        getContracts().then((res) =>
          setContracts(res.data.filter((c) => c.userId === user.id && c.status === 'active'))
        );
      }
    }
  },[user]);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  const handlePayment = async (contract, month) => {
    if (!month) return alert("Vui lòng chọn tháng cần thanh toán");

    const isDuplicate = contract.paymentHistory?.some((p) => p.month === month);
    if (isDuplicate) {
        setInfoTitle("Thông báo");
        setInfoMessage(`Tháng ${month} đã được ghi nhận trước đó. Vui lòng chọn lại.`);
        setInfoOpen(true);
    return;
    }

    const newPayment = {
      month,
      paid: true,
      paidAt: new Date().toISOString().split("T")[0],
    };

    const updated = {
      ...contract,
      paymentHistory: [...(contract.paymentHistory || []), newPayment],
    };

    await updateContract(contract.id, updated);
    setMonthInput((prev) => ({ ...prev, [contract.id]: "" }));
    loadContracts();
  };

  if (!user) {
    return <p className="text-center p-6">Vui lòng đăng nhập để xem lịch sử thanh toán.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Lịch sử thanh toán</h2>
      {contracts.length === 0 ? (
        <p>Không có hợp đồng nào.</p>
      ) : (
        <div className="space-y-6">
          {contracts.map((c) => (
            <div key={c.id} className="bg-white shadow rounded p-4">
              <h3 className="font-semibold mb-2">
                Hợp đồng {c.id} – Phòng {c.propertyId}
              </h3>
              {c.paymentHistory?.length > 0 ? (
                <ul className="list-disc pl-6 text-sm">
                  {c.paymentHistory.map((p, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{p.month}</span> –{" "}
                      {p.paid ? (
                        <span className="text-green-600">
                          Đã trả (ngày {p.paidAt})
                        </span>
                      ) : (
                        <span className="text-red-600">Chưa trả</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có thanh toán nào.</p>
              )}
              {user.role === "admin" && c.status === "active" && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="month"
                    className="border rounded px-2 py-1"
                    value={monthInput[c.id] || ""}
                    onChange={(e) =>
                      setMonthInput((prev) => ({
                        ...prev,
                        [c.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handlePayment(c, monthInput[c.id])}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Đã trả tiền
                  </button>
                </div>
              )}
            </div>
          ))}
          <div>
          <Link
            to={`/`}
            className="bg-gray-200 text-gray-900 px-3 py-1 rounded hover:rounded-xl w-32 text-center"
          >
            Quay lại
          </Link>
          </div>
        </div>
      )}
        <ConfirmModal
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
