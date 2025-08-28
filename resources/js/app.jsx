import "./bootstrap";
import "../css/app.css";
import "react-toastify/dist/ReactToastify.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import AppToast from "@/components/common/AppToast";

const appName = import.meta.env.VITE_APP_NAME || "Ingkenefutsal Web Magelang";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <AuthModalProvider>
                    <AuthProvider initialUser={props.auth?.user}>
                        <CartProvider>
                            <>
                                <App {...props} />
                                <AppToast />
                            </>
                        </CartProvider>
                    </AuthProvider>
                </AuthModalProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
