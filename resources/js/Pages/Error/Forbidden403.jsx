import React from "react";
import { Link } from "@inertiajs/react";
import Button from "@/components/Common/Button";

export default function Forbidden403({
    message = "Anda tidak memiliki izin untuk mengakses halaman ini.",
    dashboardUrl = "/",
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 mb-6 mx-auto">
                    {/* simple shield + lock svg */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-10 h-10"
                    >
                        <path
                            fill="currentColor"
                            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM12 13a2 2 0 100-4 2 2 0 000 4z"
                        />
                    </svg>
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-primary-600">
                    403
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-700">
                    {message}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        variant="primary"
                        onClick={() => window.history.back()}
                        className="px-5 py-3 rounded-lg"
                    >
                        Kembali
                    </Button>

                    <Link href={dashboardUrl}>
                        <Button
                            variant="primary"
                            className="px-5 py-3 rounded-lg "
                        >
                            Ke Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                    <p>Hubungi admin jika kamu pikir ini sebuah kesalahan.</p>
                </div>
            </div>
        </div>
    );
}
