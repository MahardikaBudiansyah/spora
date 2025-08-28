// components/Common/Tooltip.jsx
export default function Tooltip({ children, text, position = "top" }) {
    return (
        <div className="relative group inline-block max-w-full">
            {children}
            <div
                className={`absolute z-10 whitespace-nowrap text-xs px-2 py-1 rounded bg-black text-white
                ${position === "top" ? "bottom-full mb-1" : "top-full mt-1"} 
                left-1/2 transform -translate-x-1/2 hidden group-hover:block`}
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
