import { useAuthModal } from "@/contexts/AuthModalContext"; // sesuaikan path
import AuthModal from "@/components/user/auth/AuthModal";
import Navbar from "@/Layouts/User/Navbar";
import Footer, { FooterBottom } from "@/Layouts/User/Footer";

export default function UserLayout({ children, footerType = "full" }) {
    const {
        modalType,
        isModalVisible,
        modalLoginDefault,
        closeModal,
        openModal,
        setModalLoginDefault,
        setModalType,
        setIsModalVisible,
    } = useAuthModal();

    const handleRegisterSuccess = (data) => {
        setModalType("login");
        setModalLoginDefault(data);
        setIsModalVisible(true);
    };

    return (
        <>
            <Navbar openModal={openModal} />
            <main className="mt-20 bg-light dark:bg-dark text-gray-800 dark:text-white text-sm">
                {children}
            </main>

            {footerType === "full" ? <Footer /> : <FooterBottom />}

            {modalType && (
                <AuthModal
                    type={modalType}
                    show={isModalVisible}
                    onClose={closeModal}
                    onSwitchModal={openModal}
                    loginDefaults={modalLoginDefault}
                    onRegisterSuccess={handleRegisterSuccess}
                />
            )}
        </>
    );
}
