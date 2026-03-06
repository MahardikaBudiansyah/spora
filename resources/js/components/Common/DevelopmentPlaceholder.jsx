import Button from "@/components/Common/Button";
import Modal from "@/components/Common/Modal";

export default function DevelopmentPlaceholder({
    title = "Fitur",
    show,
    onClose,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="flex flex-col items-center justify-center p-12 text-center bg-transparent">
                <div className="text-8xl mb-6 transform hover:scale-110 transition-transform duration-300 cursor-default">
                    🚀
                </div>

                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {title} Sedang Dikembangkan
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-lg mx-auto text-lg leading-relaxed">
                    Kami sedang meramu fitur ini agar siap memberikan pengalaman
                    terbaik untuk manajemen venue Anda. Mohon tunggu informasi
                    selanjutnya!
                </p>

                <Button
                    variant="primary"
                    className="mt-10 px-10 py-3 text-lg rounded-full shadow-lg hover:shadow-primary/30 transition-all"
                    onClick={onClose}
                >
                    Mengerti!
                </Button>
            </div>
        </Modal>
    );
}
