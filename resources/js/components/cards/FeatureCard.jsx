import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const colorMaps = {
    emerald: {
        subtle: "bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-900 dark:text-emerald-400 dark:border-emerald-800",
        solid: "bg-emerald-600 text-white border-transparent dark:bg-emerald-700",
        outline:
            "border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400",
    },
    amber: {
        subtle: "bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-900 dark:text-amber-400 dark:border-amber-800",
        solid: "bg-amber-600 text-white border-transparent dark:bg-amber-700",
        outline:
            "border-amber-600 text-amber-700 dark:border-amber-500 dark:text-amber-400",
    },
    cyan: {
        subtle: "bg-cyan-50 text-cyan-800 border-cyan-100 dark:bg-cyan-900 dark:text-cyan-400 dark:border-cyan-800",
        solid: "bg-cyan-600 text-white border-transparent dark:bg-cyan-700",
        outline:
            "border-cyan-600 text-cyan-700 dark:border-cyan-500 dark:text-cyan-400",
    },
    red: {
        subtle: "bg-red-50 text-red-800 border-red-100 dark:bg-red-900 dark:text-red-400 dark:border-red-800",
        solid: "bg-red-600 text-white border-transparent dark:bg-red-700",
        outline:
            "border-red-600 text-red-700 dark:border-red-500 dark:text-red-400",
    },
};

const getVariantClasses = (color, variant) => {
    const selectedColor = colorMaps[color] || colorMaps.emerald;
    return selectedColor[variant] || selectedColor.subtle;
};

export default function FeatureCard({
    color = "emerald",
    variant = "subtle",
    className = "",
    children,
    animate = true,
    ...props
}) {
    const baseClasses = "rounded-lg p-3 border";
    const variantClasses = getVariantClasses(color, variant);

    const Component = animate ? motion.div : "div";
    const animationProps = animate
        ? {
              initial: { opacity: 0, scale: 0.98 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.2 },
          }
        : {};

    return (
        <Component
            className={twMerge(baseClasses, variantClasses, className)}
            {...animationProps}
            {...props}
        >
            {children}
        </Component>
    );
}
