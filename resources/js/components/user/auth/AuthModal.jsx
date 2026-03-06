import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { useAuthModal } from "@/contexts/AuthModalContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Card, CardBody, CardHeader } from "@/components/common/Card";
import { X, Info } from "lucide-react";
import BannerAlert from "@/components/Common/BannerAlert";

export default function AuthModal({
    type,
    show,
    onClose,
    onSwitchModal,
    loginDefaults,
    onRegisterSuccess,
}) {
    const [authMode, setAuthMode] = useState(type);
    const [prefill, setPrefill] = useState(null);
    const { showBanner } = useAuthModal();
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (show) {
            setAuthMode(type);
            setDismissed(false);
            setPrefill(type === "login" ? loginDefaults : null);
        }
    }, [show, type, loginDefaults]);

    const handleSwitch = (newType) => {
        setAuthMode(newType);
        setPrefill(null);
        onSwitchModal(newType);
    };

    const handleClose = () => {
        setAuthMode(type);
        setPrefill(null);
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="sm" closeable={true}>
            <Card className="p-2 md:p-6 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <CardHeader className="py-2 text-lg font-semibold border-none">
                    {authMode === "login" ? "Masuk" : "Buat Akun Baru"}
                </CardHeader>

                <CardBody className="py-2">
                    {authMode === "login" && showBanner && !dismissed && (
                        <BannerAlert
                            type="warning"
                            size="xs"
                            className="mt-0 mb-4"
                        >
                            Login untuk melihat keranjang
                        </BannerAlert>
                    )}
                    {authMode === "login" ? (
                        <LoginForm
                            onSuccess={handleClose}
                            onSwitchToRegister={() => handleSwitch("register")}
                            defaultValues={prefill}
                        />
                    ) : (
                        <RegisterForm
                            onSuccess={({ identifier, password }) => {
                                onRegisterSuccess({ identifier, password });
                            }}
                        />
                    )}

                    <div className="flex justify-between gap-6 text-xs font-semibold text-primary-600 dark:text-primary-500 py-2 mt-2">
                        {authMode === "login" ? (
                            <>
                                <div>
                                    <span className="text-gray-900 dark:text-gray-100 font-normal pr-1">
                                        Belum Punya Akun?
                                    </span>
                                    <button
                                        type="button"
                                        className="font-bold hover:underline"
                                        onClick={() => handleSwitch("register")}
                                    >
                                        Daftar
                                    </button>
                                </div>
                                <a
                                    href={route("merchant.login")}
                                    className="hover:underline"
                                >
                                    Masuk Akun Mitra
                                </a>
                            </>
                        ) : (
                            <>
                                <div>
                                    <span className="text-gray-900 dark:text-gray-100 font-normal pr-1">
                                        Sudah Punya Akun?
                                    </span>
                                    <button
                                        type="button"
                                        className="font-bold hover:underline"
                                        onClick={() => handleSwitch("login")}
                                    >
                                        Masuk
                                    </button>
                                </div>
                                <a
                                    href={route("merchant.register")}
                                    className="hover:underline"
                                >
                                    Daftar Akun Mitra
                                </a>
                            </>
                        )}
                    </div>
                </CardBody>
            </Card>
        </Modal>
    );
}
