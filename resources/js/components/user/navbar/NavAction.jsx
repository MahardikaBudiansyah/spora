import Button from "@/components/common/Button";

export default function NavAction({ onOpenModal }) {
    return (
        <div className="hidden md:flex gap-2">
            <Button
                onClick={() => onOpenModal("login")}
                variant="outline"
                size="md"
                className="text-sm"
            >
                Masuk
            </Button>
            <Button
                onClick={() => onOpenModal("register")}
                variant="primary"
                size="md"
                className="text-sm"
            >
                Daftar
            </Button>
        </div>
    );
}
