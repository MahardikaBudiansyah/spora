import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function PasswordInput({
    id,
    name,
    value,
    onChange,
    className = "",
    required = false,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <div className="relative">
            <input
                id={id}
                name={name}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                required={required}
                className={twMerge(
                    "block w-full rounded-md border-secondary-300 shadow-sm focus:ring-2 focus:border-primary-500 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white",
                    className
                )}
                {...props}
            />
            <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-300"
                tabIndex={-1}
                aria-label={
                    showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                }
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}
