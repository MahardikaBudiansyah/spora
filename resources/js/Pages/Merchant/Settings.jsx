import MerchantLayout from "@/Layouts/MerchantLayout";
import { Head } from "@inertiajs/react";

export default function Settings() {
    return (
        <MerchantLayout>
            <div className="">
                <Head title="Pengaturan Dashboard Mitra" />
                <h1>Welcome to the Mitra Dashboard Settings!</h1>
            </div>
        </MerchantLayout>
    );
}
