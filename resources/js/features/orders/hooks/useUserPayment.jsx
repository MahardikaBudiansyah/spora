import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

export const useUserPayment = () => {
    const handleSnapPayment = (
        snapToken,
        { onSuccess, onPending, onClose } = {},
    ) => {
        if (!window.snap) {
            toast.error(
                "Sistem pembayaran belum siap, silakan refresh halaman.",
            );
            return;
        }

        window.snap.pay(snapToken, {
            onSuccess: (result) => {
                toast.success("Pembayaran berhasil!");
                if (onSuccess) onSuccess(result);
            },
            onPending: (result) => {
                toast.info("Menunggu pembayaran.");
                if (onPending) onPending(result);
            },
            onError: (result) => {
                toast.error("Pembayaran gagal.");
            },
            onClose: () => {
                toast.warning("Pembayaran belum diselesaikan.");
                if (onClose) onClose();
            },
        });
    };

    /**
     * @param {string} slug - Slug booking atau membership
     * @param {string} routeName - Nama rute (contoh: user.bookings.payment_token)
     * @param {string} reloadKey - Key data yang perlu di-reload (contoh: 'bookings' atau 'memberships')
     */
    const getPaymentToken = (slug, routeName, reloadKey = "bookings") => {
        router.post(
            route(routeName, slug),
            {},
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    // Mengambil token dari flash props yang dikirim controller
                    const token = page.props.flash?.snap_token;

                    if (token) {
                        handleSnapPayment(token, {
                            // Melakukan reload partial agar data UI terupdate tanpa refresh full page
                            onSuccess: () =>
                                router.reload({ only: [reloadKey] }),
                            onPending: () =>
                                router.reload({ only: [reloadKey] }),
                        });
                    }
                },
                onError: (err) => {
                    const message =
                        Object.values(err)[0] ||
                        "Gagal mengambil token pembayaran.";
                    toast.error(message);
                },
            },
        );
    };

    return { getPaymentToken, handleSnapPayment };
};
