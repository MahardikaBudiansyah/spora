// useModal.jsx
import { useState, useCallback } from "react";

export default function useModal() {
    const [openModal, setOpenModal] = useState(null);
    const [data, setData] = useState(null);

    const open = useCallback((name, payload = null) => {
        setOpenModal(name);
        setData(payload);
    }, []);

    const close = useCallback(() => {
        setOpenModal(null);
        setData(null);
    }, []);

    const isOpen = useCallback((name) => openModal === name, [openModal]);

    return { isOpen, open, close, data };
}
