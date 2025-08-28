import MerchantLayout from "@/Layouts/MerchantLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <MerchantLayout>
            <div className="">
                <Head title="Dashboard Mitra" />
                <h1>Welcome to the Mitra Dashboard!</h1>
            </div>
        </MerchantLayout>
    );
}
