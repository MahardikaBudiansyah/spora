import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;
    const admin = auth?.admin;

    return (
        <AdminLayout>
            <div className="">
                <Head title="Dashboard Admin" />
                <h1>Selamat Datang Kembali Admin, {admin?.name ?? "Admin"}!</h1>
            </div>
        </AdminLayout>
    );
}
