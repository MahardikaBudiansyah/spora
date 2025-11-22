export default function Footer() {
    return (
        <footer className="left-64 text-right py-4 px-2">
            <span className="text-xs text-stone-400 dark:text-stone-500">
                © 2025{" "}
                <a href={route("home")} className="hover:underline">
                    Spora™
                </a>
                . All Rights Reserved.
            </span>
        </footer>
    );
}
