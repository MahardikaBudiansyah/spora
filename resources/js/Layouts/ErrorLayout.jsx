import React from "react";
import { Link, Head } from "@inertiajs/react";
import Button from "@/components/Common/Button";

export default function ErrorLayout({ code, message, dashboardUrl }) {
    return (
        <>
            {/* Set title di head */}
            <Head
                title={`${code} " - " ${message?.substring(0, 50) || "Error"}`}
            />
            <div
                style={{ fontFamily: "system-ui, sans-serif" }}
                className="min-h-screen flex items-center justify-center bg-[#f9fafb] p-6"
            >
                <div className="text-center max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                    {/* Judul */}

                    <h1 className="text-[5rem] font-extrabold text-primary-500">
                        {code}
                    </h1>

                    {/* Pesan */}
                    <p className="my-3 text-lg text-gray-600">
                        {message || "Terjadi kesalahan pada aplikasi."}
                    </p>

                    {/* Tombol */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
                        <Button
                            type="button"
                            variant="light"
                            onClick={() => window.history.back()}
                            className="px-6 py-3 text-base font-normal"
                        >
                            Kembali
                        </Button>

                        <Link href={dashboardUrl}>
                            <Button
                                type="button"
                                variant="primary"
                                className="px-6 py-3 text-base font-normal"
                            >
                                Ke Dashboard
                            </Button>
                        </Link>
                    </div>

                    {/* Catatan kecil */}
                    <div className="mt-4 text-sm text-gray-400">
                        Hubungi admin jika menurut Anda ini sebuah kesalahan.
                    </div>
                </div>
            </div>
        </>
    );
}
