import { ArrowRight } from "lucide-react";
import Button from "@/components/Common/Button";

export default function HeroSection() {
    return (
        <section className="bg-center bg-cover bg-no-repeat bg-[url('/assets/images/hero-section.jpg')] bg-gray-700 bg-blend-multiply">
            <div className="px-4 mx-auto max-w-screen-xl text-center sm:text-center lg:text-left pt-48 pb-32 lg:pt-48 lg:pb-40">
                <h1 className="mb-4 text-4xl font-extrabold tracking-wide leading-tight text-white sm:text-5xl lg:text-6xl lg:w-1/2">
                    Ingkenefutsal Web Magelang
                </h1>
                <p className="mb-8 text-base font-normal text-gray-100 lg:text-xl lg:w-1/2">
                    Platform all-in-one untuk sewa lapangan. Olahraga makin
                    mudah dan menyenangkan!
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                    <Button
                        variant="primary"
                        size=""
                        className="inline-flex justify-center items-center py-3 px-5 text-base transition"
                    >
                        Ayo Daftar <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
