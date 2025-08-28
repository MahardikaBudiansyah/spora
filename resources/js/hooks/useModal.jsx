import { useState, useCallback } from "react";

export default function useModal() {
    const [openModal, setOpenModal] = useState(null);
    const [onCloseCallback, setOnCloseCallback] = useState(null);

    const open = useCallback((name, callback = null) => {
        setOpenModal(name);
        setOnCloseCallback(() => callback); // simpan callback jika ada
    }, []);

    const close = useCallback(() => {
        setOpenModal(null);
        if (onCloseCallback) {
            onCloseCallback();
            setOnCloseCallback(null); // reset callback setelah dipakai
        }
    }, [onCloseCallback]);

    const isOpen = useCallback((name) => openModal === name, [openModal]);

    return { isOpen, open, close };
}
