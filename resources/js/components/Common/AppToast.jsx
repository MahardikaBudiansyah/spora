import { ToastContainer } from "react-toastify";
import { useTheme } from "@/contexts/ThemeContext";

export default function AppToast() {
    const { isDark } = useTheme();

    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            theme={isDark ? "dark" : "light"}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
        />
    );
}
