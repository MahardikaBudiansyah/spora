import React from "react";
import { twMerge } from "tailwind-merge";
import Tippy from "@tippyjs/react";

export default function Badge({
    children,
    color = "gray",
    variant = "subtle",
    className = "",
    tooltip,
    ...props
}) {
    const baseStyle =
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold cursor-default";

    const subtleMap = {
        slate: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
        zinc: "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100",
        neutral:
            "bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100",
        stone: "bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-100",
        red: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100",
        orange: "bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100",
        amber: "bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-100",
        yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
        lime: "bg-lime-100 text-lime-800 dark:bg-lime-700 dark:text-lime-100",
        green: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100",
        emerald:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100",
        teal: "bg-teal-100 text-teal-800 dark:bg-teal-700 dark:text-teal-100",
        cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-700 dark:text-cyan-100",
        sky: "bg-sky-100 text-sky-800 dark:bg-sky-700 dark:text-sky-100",
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100",
        indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100",
        violet: "bg-violet-100 text-violet-800 dark:bg-violet-700 dark:text-violet-100",
        purple: "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100",
        fuchsia:
            "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-700 dark:text-fuchsia-100",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100",
        rose: "bg-rose-100 text-rose-800 dark:bg-rose-700 dark:text-rose-100",
    };

    const solidMap = {
        slate: "bg-slate-600 text-white dark:bg-slate-400 dark:text-slate-950",
        gray: "bg-gray-600 text-white dark:bg-gray-400 dark:text-gray-950",
        zinc: "bg-zinc-600 text-white dark:bg-zinc-400 dark:text-zinc-950",
        neutral:
            "bg-neutral-600 text-white dark:bg-neutral-400 dark:text-neutral-950",
        stone: "bg-stone-600 text-white dark:bg-stone-400 dark:text-stone-950",
        red: "bg-red-600 text-white dark:bg-red-400 dark:text-red-950",
        orange: "bg-orange-600 text-white dark:bg-orange-400 dark:text-orange-950",
        amber: "bg-amber-600 text-white dark:bg-amber-400 dark:text-amber-950",
        yellow: "bg-yellow-500 text-black dark:bg-yellow-400 dark:text-yellow-950",
        lime: "bg-lime-600 text-white dark:bg-lime-400 dark:text-lime-950",
        green: "bg-green-600 text-white dark:bg-green-400 dark:text-green-950",
        emerald:
            "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950",
        teal: "bg-teal-600 text-white dark:bg-teal-400 dark:text-teal-950",
        cyan: "bg-cyan-600 text-white dark:bg-cyan-400 dark:text-cyan-950",
        sky: "bg-sky-600 text-white dark:bg-sky-400 dark:text-sky-950",
        blue: "bg-blue-600 text-white dark:bg-blue-400 dark:text-blue-950",
        indigo: "bg-indigo-600 text-white dark:bg-indigo-400 dark:text-indigo-950",
        violet: "bg-violet-600 text-white dark:bg-violet-400 dark:text-violet-950",
        purple: "bg-purple-600 text-white dark:bg-purple-400 dark:text-purple-950",
        fuchsia:
            "bg-fuchsia-600 text-white dark:bg-fuchsia-400 dark:text-fuchsia-950",
        pink: "bg-pink-600 text-white dark:bg-pink-400 dark:text-pink-950",
        rose: "bg-rose-600 text-white dark:bg-rose-400 dark:text-rose-950",
    };

    const colorClasses =
        variant === "solid"
            ? solidMap[color] || solidMap.gray
            : subtleMap[color] || subtleMap.gray;

    const combined = twMerge(baseStyle, colorClasses, className);

    const badgeContent = (
        <span className={combined} {...props}>
            {children}
        </span>
    );

    return tooltip ? (
        <Tippy content={tooltip} touch={false}>
            {badgeContent}
        </Tippy>
    ) : (
        badgeContent
    );
}
