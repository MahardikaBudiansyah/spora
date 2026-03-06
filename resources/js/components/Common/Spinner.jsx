import React from "react";
import {
    ClipLoader,
    RingLoader,
    BeatLoader,
    BarLoader,
    BounceLoader,
    CircleLoader,
    ClimbingBoxLoader,
    ClockLoader,
    DotLoader,
    FadeLoader,
    GridLoader,
    HashLoader,
    MoonLoader,
    PacmanLoader,
    PropagateLoader,
    PuffLoader,
    PulseLoader,
    RiseLoader,
    RotateLoader,
    ScaleLoader,
    SkewLoader,
    SquareLoader,
    SyncLoader,
} from "react-spinners";
import { twMerge } from "tailwind-merge";
import { useTheme } from "@/contexts/ThemeContext";

export default function Spinner({
    type = "clip",
    size = "md",
    color = "",
    className = "",
}) {
    const { isDark } = useTheme();

    const sizes = {
        sm: 12,
        md: 24,
        lg: 32,
    };

    const getLoaderColor = () => {
        if (color === "inherit" || color === "currentColor")
            return "currentColor";
        if (color) return color;
        return isDark ? "#06b6d4" : "#22d3ee";
    };

    const loaders = {
        bar: BarLoader,
        beat: BeatLoader,
        bounce: BounceLoader,
        circle: CircleLoader,
        climbingBox: ClimbingBoxLoader,
        clip: ClipLoader,
        clock: ClockLoader,
        dot: DotLoader,
        fade: FadeLoader,
        grid: GridLoader,
        hash: HashLoader,
        moon: MoonLoader,
        pacman: PacmanLoader,
        propagate: PropagateLoader,
        puff: PuffLoader,
        pulse: PulseLoader,
        ring: RingLoader,
        rise: RiseLoader,
        rotate: RotateLoader,
        scale: ScaleLoader,
        skew: SkewLoader,
        square: SquareLoader,
        sync: SyncLoader,
    };

    const LoaderComponent = loaders[type] || ClipLoader;

    return (
        <div
            className={twMerge(
                "inline-flex justify-center items-center",
                className
            )}
        >
            <LoaderComponent
                size={sizes[size] || sizes.md}
                color={getLoaderColor()}
                speedMultiplier={1}
            />
        </div>
    );
}
