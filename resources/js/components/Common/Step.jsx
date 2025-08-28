import { twMerge } from "tailwind-merge";

export default function Step({ isActive, children, className = "" }) {
    return (
        <div
            className={twMerge(
                "w-full",
                !isActive && "hidden", // cuma sembunyikan, nggak hapus
                className
            )}
        >
            {children}
        </div>
    );
}
