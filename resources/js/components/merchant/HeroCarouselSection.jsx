import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const slides = [
    {
        id: 1,
        image: "/assets/images/hero-carousel-1.jpg",
        title: "Selamat Datang di IngkeneFutsal",
        subtitle: "Pesan lapangan futsal dengan mudah dan cepat",
    },
    {
        id: 2,
        image: "/assets/images/hero-carousel-2.jpg",
        title: "Jadwal Fleksibel",
        subtitle: "Pilih slot waktu yang sesuai kebutuhanmu",
    },
    {
        id: 3,
        image: "/assets/images/hero-carousel-3.jpg",
        title: "Merchant Terpercaya",
        subtitle: "Bekerja sama dengan banyak venue profesional",
    },
    {
        id: 4,
        image: "/assets/images/hero-carousel-4.jpg",
        title: "Merchant Terpercaya",
        subtitle: "Bekerja sama dengan banyak venue profesional",
    },
];

export default function HeroCarouselSection() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {slides.map((slide, index) => (
                <motion.div
                    key={slide.id}
                    className="absolute top-0 left-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index === current ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-2">
                            {slide.title}
                        </h2>
                        <p className="text-base md:text-lg max-w-xl">
                            {slide.subtitle}
                        </p>
                    </div>
                </motion.div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-3 h-3 rounded-full ${
                            idx === current ? "bg-white" : "bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
