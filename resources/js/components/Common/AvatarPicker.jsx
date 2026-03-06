import { useState } from "react";
import Modal from "@/components/Common/Modal";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import { Plus } from "lucide-react";
import Button from "@/components/Common/Button";
import CloseButtonModal from "@/components/Common/CloseButtonModal";

export default function AvatarPicker({
    show,
    onClose,
    onSelect,
    onUploadClick,
    uploadedFile,
}) {
    const [selected, setSelected] = useState(null);

    const avatars = [
        "boy_badminton.png",
        "boy_basket.png",
        "boy_futsal.png",
        "boy_golf.png",
        "boy_gym.png",
        "boy_padel.png",
        "boy_voli.png",
        "boy_yoga.png",
        "girl_badminton.png",
        "girl_basket.png",
        "girl_futsal.png",
        "girl_golf.png",
        "girl_gym.png",
        "girl_padel.png",
        "girl_voli.png",
        "girl_yoga.png",
    ];

    const avatarImages = avatars.map((fileName) => {
        const isBoy = fileName.toLowerCase().includes("boy");
        const url = `/assets/avatars/${fileName}`;

        return {
            url,
            fileName,
            gender: isBoy ? "boy" : "girl",
        };
    });

    const handleConfirm = () => {
        if (selected) {
            onSelect(selected);
            setSelected(null);
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="3xl"
            className="p-4 w-full"
        >
            <Card className="relative rounded-lg shadow-none border-none dark:border-none overflow-visible">
                <CloseButtonModal onClose={onClose} />
                <CardHeader className="py-2 px-4 border-none">
                    <h2 className="font-bold text-lg">Pilih Karakter Avatar</h2>
                </CardHeader>
                <CardBody className="py-4 overflow-visible flex flex-col gap-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 max-h-[450px] overflow-y-auto p-4">
                        <button
                            onClick={onUploadClick}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-secondary-300 dark:border-secondary-500 rounded-full w-20 h-20 hover:border-primary-500 dark:hover:border-secondary-400 group"
                        >
                            <Plus className="w-8 h-8 text-secondary-400 dark:text-secondary-500 group-hover:text-primary-500 dark:group-hover:text-secondary-400" />
                        </button>

                        {uploadedFile && (
                            <button
                                onClick={() => setSelected(uploadedFile)}
                                className={`relative w-20 h-20 rounded-full transition-all duration-300 shadow-md p-1 bg-secondary-200 dark:bg-secondary-600 ${
                                    selected?.url === uploadedFile.url
                                        ? `ring-4 ring-secondary-400 dark:ring-secondary-600 ring-offset-2 ring-offset-white dark:ring-offset-secondary-800 scale-110 z-10`
                                        : "hover:scale-105 opacity-90 hover:opacity-100"
                                }`}
                            >
                                <img
                                    src={uploadedFile.url}
                                    className="w-full h-full object-cover rounded-full drop-shadow-md"
                                    alt="Uploaded Preview"
                                />
                            </button>
                        )}

                        {avatarImages.map((avatar, index) => {
                            const isSelected = selected?.url === avatar.url;

                            const isBoy = avatar.gender === "boy";

                            const bgClass = isBoy
                                ? "bg-primary-600"
                                : "bg-pink-600";

                            const ringColorClass = isBoy
                                ? "ring-primary-600"
                                : "ring-pink-600";

                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelected(avatar)}
                                    className={`relative w-20 h-20 rounded-full transition-all duration-300 shadow-md p-1 ${bgClass} ${
                                        isSelected
                                            ? `ring-4 ${ringColorClass} ring-offset-2 ring-offset-white dark:ring-offset-secondary-800 scale-110 z-10`
                                            : "hover:scale-105 opacity-90 hover:opacity-100"
                                    }`}
                                >
                                    <img
                                        src={avatar.url}
                                        alt={avatar.fileName}
                                        className="w-full h-full object-contain drop-shadow-md"
                                    />
                                </button>
                            );
                        })}
                    </div>
                </CardBody>
                <CardFooter className="py-2 px-4 flex justify-end gap-2 border-none">
                    <Button variant="secondary" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleConfirm} disabled={!selected}>
                        Gunakan Avatar Ini
                    </Button>
                </CardFooter>
            </Card>
        </Modal>
    );
}
