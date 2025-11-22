import MerchantLayout from "@/Layouts/MerchantLayout";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;
    const merchant = auth?.merchant;

    return (
        <MerchantLayout>
            <div className="">
                <Head title="Dashboard Mitra" />
                <h1>
                    Selamat Datang Kembali Mitra, {merchant?.name ?? "Mitra"}!
                </h1>
            </div>
        </MerchantLayout>
    );
}
