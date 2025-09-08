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
import { useTheme } from "@/contexts/ThemeContext"; // pastikan path benar

export default function Spinner({
    type = "clip", // tipe spinner: clip, ring, beat
    size = "md", // ukuran: sm, md, lg
    className = "",
}) {
    const { isDark } = useTheme(); // ambil theme dari context

    // mapping ukuran Tailwind ke pixel react-spinners
    const sizes = {
        sm: 12,
        md: 24,
        lg: 32,
    };

    // warna sesuai dark mode
    const colors = {
        light: "#22d3ee", // primary-400
        dark: "#06b6d4", // primary-500
    };

    // pilih komponen loader
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
        <div className={twMerge("flex justify-center items-center", className)}>
            <LoaderComponent
                size={sizes[size] || sizes.md}
                color={isDark ? colors.dark : colors.light}
                speedMultiplier={1} // optional
            />
        </div>
    );
}
