import { useEffect, useState } from "react";
import { getProperties } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";

export default function Home() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        getProperties().then((res) => setProperties(res.data));
    }, []);

    return (
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
            ))}
        </div>
    );
}
