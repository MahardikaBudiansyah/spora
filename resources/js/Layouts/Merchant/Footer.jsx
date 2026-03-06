export default function Footer() {
    return (
        <footer className="mt-auto py-6 px-8 border-t border-secondary-100 dark:border-secondary-800">
            <div className="flex flex-col md:flex-row justify-center md:justify-end items-center gap-2">
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                    © {new Date().getFullYear()}{" "}
                    <a
                        href={route("home")}
                        className="hover:underline font-medium text-primary-600 dark:text-primary-400"
                    >
                        Spora™
                    </a>
                    . All Rights Reserved.
                </span>
                <span className="hidden md:inline text-secondary-300">|</span>
                <div className="flex gap-4">
                    <a
                        href="#"
                        className="text-[10px] uppercase tracking-wider text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                    >
                        Bantuan
                    </a>
                    <a
                        href="#"
                        className="text-[10px] uppercase tracking-wider text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                    >
                        Kebijakan
                    </a>
                </div>
            </div>
        </footer>
    );
}
