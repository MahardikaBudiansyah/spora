import Tippy from "@tippyjs/react";

export default function ImagePlaceholder({
    className = "",
    label = "Gambar Belum Tersedia",
    tooltip = "Data gambar ini belum diunggah oleh pengguna.",
}) {
    return (
        <Tippy content={tooltip}>
            <div className={`w-full h-full cursor-help ${className}`}>
                <svg
                    viewBox="0 0 356 217"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full bg-secondary-50 dark:bg-secondary-900/50"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <g transform="translate(178, 100)">
                        <path
                            d="M-30 20 L-10 -15 L5 5 L20 -25 L40 20 H-30Z"
                            className="fill-secondary-300 dark:fill-secondary-700"
                        />
                        <circle
                            cx="25"
                            cy="-35"
                            r="8"
                            className="fill-secondary-300 dark:fill-secondary-700"
                        />

                        <text
                            y="50"
                            fontSize="13"
                            fontFamily="Inter, ui-sans-serif, system-ui"
                            fontWeight="600"
                            textAnchor="middle"
                            className="fill-secondary-400 dark:fill-secondary-500 uppercase tracking-widest"
                        >
                            {label}
                        </text>
                    </g>
                </svg>
            </div>
        </Tippy>
    );
}
