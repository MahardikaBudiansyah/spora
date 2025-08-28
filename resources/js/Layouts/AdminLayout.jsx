import { ToastContainer } from "react-toastify";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-200">
            <div className="pl-0 md:pl-64 flex flex-col min-h-screen w-full">
                <main className="m-4 md:m-2 mt-36 md:mt-24">{children}</main>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
}
