import { ToastContainer } from "react-toastify";
import Navbar from "@/Layouts/Admin/Navbar";
import Sidenav from "@/Layouts/Admin/Sidenav";
import Footer from "@/Layouts/Admin/Footer";
import LoadingSkeleton from "@/components/Common/LoadingSkeleton";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950 text-gray-700 dark:text-gray-100">
            {/* Sidebar */}
            <Sidenav className="hidden md:block" />

            {/* Main content */}
            <div className="pl-0 md:pl-64 flex flex-col min-h-screen w-full">
                <Navbar />

                {/* Main area */}
                <main
                    id="main-content"
                    className="m-4 md:m-2 mt-36 md:mt-24 flex-1"
                >
                    {children ?? <LoadingSkeleton />}
                </main>

                {/* Toast notification */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    pauseOnUnmount={false}
                />

                {/* Footer */}
                <Footer className="mt-auto" />
            </div>
        </div>
    );
}
