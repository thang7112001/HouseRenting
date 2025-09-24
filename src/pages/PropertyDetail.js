import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../services/propertyService";
import { Link } from "react-router-dom";
import ComfirmModal from "../components/ComfirmModal";
import { createContract } from "../services/contractService";
import { useNavigate } from "react-router-dom";

export default function PropertyDetail() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [confirmRentOpen, setConfirmRentOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoTitle, setInfoTitle] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const navigate = useNavigate()
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        getPropertyById(id).then((res) => setProperty(res.data));
    }, [id]);

    if (!property) return <p className="text-center p-6">Đang tải...</p>;

    const images = Array.isArray(property.images) ? property.images : [];

    const goPrev = () => {
        if (images.length === 0) return;
        setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
    };
    const goNext = () => {
        if (images.length === 0) return;
        setCurrentIdx((prev) => (prev + 1) % images.length);
    };
    const goTo = (idx) => setCurrentIdx(idx);

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
            setInfoTitle("Thành công");
            setInfoMessage("Đã gửi yêu cầu thuê. Chờ admin duyệt.");
            setInfoOpen(true);
        } catch (e) {
            setInfoTitle("Lỗi");
            setInfoMessage("Thuê thất bại ❌");
            setInfoOpen(true);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-2">{property.name}</h2>
                <p>{property.description}</p>
                <p className="text-gray-500">{property.address}</p>
                <p className="text-blue-600 font-semibold text-lg mt-2">
                    {property.price.toLocaleString()} VNĐ/tháng
                </p>
                <p className="mt-2">
                    Trạng thái:{" "}
                    <span
                        className={`font-semibold ${
                            property.status === "available" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {property.status === "available" ? "Còn trống" : "Đã thuê"}
                    </span>
                </p>

                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Hình ảnh</h3>
                    {images.length > 0 ? (
                        <div className="relative w-full h-64 bg-gray-100 rounded overflow-hidden">
                            <img src={images[currentIdx]} alt={`Hình ${currentIdx + 1}`} className="w-full h-full object-cover" />
                            {images.length > 1 && (
                                <>
                                    <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center">‹</button>
                                    <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center">›</button>
                                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
                                        {images.map((_, i) => (
                                            <button key={i} onClick={() => goTo(i)} className={`w-2.5 h-2.5 rounded-full ${i === currentIdx ? 'bg-white' : 'bg-white/50'}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            Chưa có hình ảnh
                        </div>
                    )}
                </div>
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
                        to={`/`}
                        className="bg-gray-200 text-gray-900 px-3 py-1 rounded hover:rounded-xl w-32 text-center"
                    >
                        Quay lại
                    </Link>
                </div>
            </div>
            <ComfirmModal
                open={confirmRentOpen}
                title="Xác nhận thuê"
                message={`Bạn có chắc muốn thuê "${property.name}"?`}
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
                onConfirm={() => { 
                    setInfoOpen(false)
                    navigate('/')
                }}
            />
        </div>
    );
}
