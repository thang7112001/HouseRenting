import { useEffect } from "react";

export default function AddEditModal({ open, title, children, submitText = "Lưu", cancelText = "Hủy", onSubmit, onCancel, disabled }) {
    useEffect(() => {
        const onKey = (e) => {
            if (!open) return;
            if (e.key === "Escape") onCancel && onCancel();
            if (e.key === "Enter") onSubmit && onSubmit();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onCancel, onSubmit]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded shadow p-5 w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div className="mb-4">
                    {children}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        disabled={disabled}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                        disabled={disabled}
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </div>
    );
}
