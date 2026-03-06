import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
    const [modalType, setModalType] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalLoginDefault, setModalLoginDefault] = useState({
        identifier: "",
        password: "",
    });

    const [showBanner, setShowBanner] = useState(false);

    const openModal = (type = "login", banner = false) => {
        setModalType(type);
        setIsModalVisible(true);
        setShowBanner(banner);
        setModalLoginDefault({ identifier: "", password: "" });
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setModalType(null);
        setShowBanner(false);
        setModalLoginDefault({ identifier: "", password: "" });
    };

    return (
        <AuthModalContext.Provider
            value={{
                modalType,
                isModalVisible,
                modalLoginDefault,
                openModal,
                closeModal,
                setModalLoginDefault,
                setModalType,
                setIsModalVisible,
                showBanner,
                setShowBanner,
            }}
        >
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    return useContext(AuthModalContext);
}
