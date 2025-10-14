import { useState, forwardRef } from "react";
import IconButton from "@/components/Common/IconButton";
import { Eye, EyeOff } from "lucide-react";
import { twMerge } from "tailwind-merge";

const PasswordInput = forwardRef(
    (
        {
            id,
            name,
            value,
            onChange,
            className = "",
            required = false,
            ...props
        },
        ref // ✅ ini datang dari forwardRef
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const togglePassword = () => setShowPassword(!showPassword);

        return (
            <div className="relative">
                <input
                    ref={ref} // ✅ diteruskan ke elemen input
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={twMerge(
                        "block w-full rounded-md border-secondary-300 shadow-sm focus:ring-2 focus:border-primary-500 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white hover:border-primary-500 dark:hover:border-primary-500",
                        className
                    )}
                    {...props}
                />
                <IconButton
                    onClick={togglePassword}
                    tooltip={
                        showPassword
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                    }
                    className="absolute inset-y-0 right-0 pr-3 text-gray-500 dark:text-gray-300"
                    aria-label={
                        showPassword
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                    }
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </IconButton>
            </div>
        );
    }
);

// 🧩 Tambahkan displayName biar gak warning di dev mode
PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
