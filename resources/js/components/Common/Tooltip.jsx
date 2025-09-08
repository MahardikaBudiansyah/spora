export default function Tooltip({ children, text, position = "top" }) {
    return (
        <div className="relative group inline-block max-w-full" tabIndex={0}>
            {children}
            <div
                className={`absolute z-10 whitespace-nowrap text-xs px-2 py-1 rounded bg-black text-white
          ${position === "top" ? "bottom-full mb-1" : "top-full mt-1"}
          left-1/2 transform -translate-x-1/2
          opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150`}
            >
                {text}
                <div
                    className={`absolute w-2 h-2 bg-black rotate-45
            ${position === "top" ? "top-full" : "bottom-full"}
            left-1/2 transform -translate-x-1/2`}
                />
            </div>
        </div>
    );
}
