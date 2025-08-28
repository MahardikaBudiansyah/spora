import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import BannerSection from "@/components/common/BannerSection";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import BannerAlert from "@/components/common/BannerAlert";

export default function Dashboard({ auth, profileIncomplete }) {
    return (
        <UserLayout user={auth.user}>
            <Head title="Venue" />
            <BannerSection height="h-16" />
            <div className="px-4 py-8 max-w-screen-md mx-auto rounded-lg text-sm">
                <Card className="flex flex-col h-full min-h-screen rounded-lg shadow-none dark:border-none">
                    <CardHeader className="px-8 pt-8 pb-4 border-none">
                        <div className="text-xl font-bold dark:text-white">
                            Dashboard
                        </div>
                        {profileIncomplete && (
                            <BannerAlert type="warning">
                                🚧 Lengkapi data diri terlebih dahulu untuk
                                mengakses semua fitur dashboard.
                                <a
                                    href={route("user.profile.edit")}
                                    className="ml-2 underline font-bold text-red-500 hover:text-red-600"
                                >
                                    Lengkapi Sekarang!
                                </a>
                            </BannerAlert>
                        )}
                    </CardHeader>
                    <CardBody className="x-8 flex text-sm">
                        <div className="font-medium text-center text-gray-500 border-b border-secondary-200 dark:text-secondary-400 dark:border-gray-700">
                            <ul className="flex flex-wrap -mb-px">
                                <li className="me-2">
                                    <a
                                        href="#"
                                        className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-secondary-300 dark:hover:text-gray-300"
                                        aria-current="page"
                                    >
                                        Pesanan Saya
                                    </a>
                                </li>
                                <li className="me-2">
                                    <a
                                        href="#"
                                        className="inline-block p-4 text-primary-600 border-b-2 border-primary-600 rounded-t-lg active dark:text-primary-500 dark:border-primary-500"
                                    >
                                        Keanggotaan Venue Lapangan
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </UserLayout>
    );
}
