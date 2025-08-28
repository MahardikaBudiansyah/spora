import { useRef, useState } from "react";
import Button from "@/components/common/Button";
import InputError from "@/components/common/ErrorInput";
import InputLabel from "@/components/common/Labelnput";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/Common/TextInput";
import { useForm } from "@inertiajs/react";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("user.profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium">Hapus Akun</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Setelah akun Anda dihapus, semua sumber daya dan datanya
                    akan dihapus secara permanen. Sebelum menghapus akun Anda,
                    harap unduh data atau informasi apa pun yang ingin Anda
                    simpan.
                </p>
            </header>

            <Button variant="danger" onClick={confirmUserDeletion}>
                Hapus Akun
            </Button>

            <Modal
                maxWidth="md"
                show={confirmingUserDeletion}
                onClose={closeModal}
                initialFocus={passwordInput}
            >
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium dark:text-white">
                        Apakah Anda yakin ingin menghapus akun Anda?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Setelah akun Anda dihapus, semua sumber daya dan datanya
                        akan dihapus secara permanen. Masukkan kata sandi Anda
                        untuk mengonfirmasi bahwa Anda ingin menghapus akun Anda
                        secara permanen.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1"
                            placeholder="Kata Sandi"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            type="submit"
                            variant="danger"
                            disabled={processing}
                        >
                            Hapus Akun
                        </Button>
                        <Button variant="light" onClick={closeModal}>
                            Batal
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
