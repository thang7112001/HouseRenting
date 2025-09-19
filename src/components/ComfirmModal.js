import { useEffect } from "react";

export default function ComfirmModal({ open, title = "Xác nhận", message, confirmText = "Xác nhận", cancelText = "Hủy", onConfirm, onCancel }) {
    useEffect(() => {
        const onKey = (e) => {
            if (!open) return;
            if (e.key === "Escape") onCancel && onCancel();
            if (e.key === "Enter") onConfirm && onConfirm();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onCancel, onConfirm]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded shadow p-5 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
