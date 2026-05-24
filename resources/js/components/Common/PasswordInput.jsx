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
            isError = false,
            className = "",
            required = false,
            showInitially = false,
            placeholder = "********",
            ...props
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = useState(showInitially);
        const togglePassword = () => setShowPassword(!showPassword);

        const inputClasses = twMerge(
            "block w-full rounded-md shadow-sm " +
                "dark:bg-secondary-800 " +
                "border-secondary-300 dark:border-secondary-600 " +
                "hover:border-primary-500 hover:ring-1 hover:ring-primary-500 " +
                "focus:border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 " +
                "placeholder:text-xs placeholder:text-secondary-400 dark:placeholder:text-secondary-500 ",

            isError &&
                "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 hover:ring-red-500",
            className,
        );

        return (
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={inputClasses}
                    placeholder={placeholder}
                    {...props}
                />
                <IconButton
                    variant="ghost"
                    onClick={togglePassword}
                    tooltip={
                        showPassword
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                    }
                    className={twMerge(
                        "absolute inset-y-0 right-1 my-auto h-full flex items-center justify-center",
                        "bg-transparent border-none ring-0 outline-none shadow-none",
                        "hover:bg-transparent dark:hover:bg-transparent active:bg-transparent hover:ring-0 focus:ring-0 focus:outline-none",
                        isError
                            ? "text-red-400"
                            : "text-secondary-400 hover:text-secondary-500",
                    )}
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
    },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
