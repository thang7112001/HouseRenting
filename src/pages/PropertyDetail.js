import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../services/propertyService";

export default function PropertyDetail() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    useEffect(() => {
        getPropertyById(id).then((res) => setProperty(res.data));
    }, [id]);

    if (!property) return <p className="text-center p-6">Đang tải...</p>;

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
            </div>
        </div>
    );
}
