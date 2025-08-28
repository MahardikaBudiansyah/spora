import { useState } from "react";
import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import DeleteUserForm from "@/Pages/User/Profile/Partials/DeleteUserForm";
import UpdatePasswordForm from "@/Pages/User/Profile/Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "@/Pages/User/Profile/Partials/UpdateProfileInformationForm";
import BannerSection from "@/components/common/BannerSection";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import { KeyRound, UserRound, Trash2 } from "lucide-react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'password', 'delete'

    return (
        <UserLayout user={auth.user}>
            <Head title="Profile" />
            <BannerSection height="h-16" />
            <div className="px-4 py-8 max-w-screen-md mx-auto rounded-lg text-xs">
                <Card className="flex flex-col min-h-screen rounded-lg shadow-none dark:border-none">
                    <CardHeader className="px-8 pt-8 pb-4 border-none">
                        <div className="text-xl font-bold dark:text-white">
                            Profil Saya
                        </div>
                    </CardHeader>
                    <CardBody className="px-8 flex flex-col md:flex-row gap-8 text-sm">
                        {/* Sidebar Tabs */}
                        <div className="border-r-0 md:border-r pr-0 md:pr-4 border-secondary-200 dark:border-secondary-700 w-full md:w-48">
                            <ul className="flex flex-row md:flex-col justify-between gap-2 font-medium text-left text-gray-500 dark:text-gray-400">
                                <li>
                                    <button
                                        onClick={() => setActiveTab("profile")}
                                        className={`flex w-full items-center text-left p-2 md:p-3 border-l-4 ${
                                            activeTab === "profile"
                                                ? "border-primary-600 text-primary-500 dark:text-primary-400 bg-secondary-100 dark:bg-secondary-900"
                                                : "border-transparent hover:text-primary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                                        } rounded-md transition`}
                                    >
                                        <UserRound className="w-4 h-4 mr-2" />
                                        Data Diri
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab("password")}
                                        className={`flex w-full items-center text-left p-2 md:p-3 border-l-4 ${
                                            activeTab === "password"
                                                ? "border-primary-600 text-primary-600 dark:text-primary-500 bg-secondary-100 dark:bg-secondary-900"
                                                : "border-transparent hover:text-primary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                                        } rounded-md transition`}
                                    >
                                        <KeyRound className="w-4 h-4 mr-2" />
                                        Kata Sandi
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab("delete")}
                                        className={`flex w-full items-center text-left p-2 md:p-3 border-l-4 ${
                                            activeTab === "delete"
                                                ? "border-primary-600 text-primary-600 dark:text-primary-500 bg-secondary-100 dark:bg-secondary-900"
                                                : "border-transparent hover:text-primary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                                        } rounded-md transition`}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus Akun
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 space-y-6">
                            {activeTab === "profile" && (
                                <div className="bg-white dark:bg-secondary-900 sm:rounded-lg">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                    />
                                </div>
                            )}

                            {activeTab === "password" && (
                                <div className="bg-white dark:bg-secondary-900 sm:rounded-lg">
                                    <UpdatePasswordForm className="max-w-xl" />
                                </div>
                            )}

                            {activeTab === "delete" && (
                                <div className="bg-white dark:bg-secondary-900 sm:rounded-lg">
                                    <DeleteUserForm className="max-w-xl" />
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </UserLayout>
    );
}
