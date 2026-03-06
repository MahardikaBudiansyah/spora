import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import DeleteUserForm from "@/Pages/User/Profile/Partials/DeleteUserForm";
import UpdatePasswordForm from "@/Pages/User/Profile/Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "@/Pages/User/Profile/Partials/UpdateProfileInformationForm";
import BannerSection from "@/components/common/BannerSection";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import Tabs from "@/components/common/Tabs";
import { KeyRound, UserRound, Trash2 } from "lucide-react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    const tabs = [
        {
            id: "profile",
            label: (
                <span className="flex items-center">
                    <UserRound className="w-4 h-4 mr-2" />
                    Data Diri
                </span>
            ),
            content: (
                <div className="bg-white dark:bg-secondary-900 sm:rounded-lg">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>
            ),
        },
        {
            id: "password",
            label: (
                <span className="flex items-center">
                    <KeyRound className="w-4 h-4 mr-2" />
                    Kata Sandi
                </span>
            ),
            content: (
                <div className="bg-white dark:bg-secondary-900 sm:rounded-lg">
                    <UpdatePasswordForm />
                </div>
            ),
        },
        {
            id: "delete",
            label: (
                <span className="flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Akun
                </span>
            ),
            content: (
                <div className="bg-white dark:bg-secondary-900 sm:rounded-lg">
                    <DeleteUserForm />
                </div>
            ),
        },
    ];

    return (
        <UserLayout user={auth.user} footerType="bottom">
            <Head title="Profile" />
            <BannerSection height="h-16" />
            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-lg">
                <Card className="flex flex-col min-h-screen rounded-lg shadow-none dark:border-none">
                    <CardHeader className="px-8 pt-8 pb-4 border-none">
                        <div className="text-xl font-bold">Profil Saya</div>
                    </CardHeader>
                    <CardBody className="px-8 flex flex-col gap-8">
                        <Tabs
                            tabs={tabs}
                            defaultActive={0}
                            orientation="vertical"
                        />
                    </CardBody>
                </Card>
            </div>
        </UserLayout>
    );
}
