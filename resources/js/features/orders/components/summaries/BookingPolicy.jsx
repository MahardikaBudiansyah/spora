import { Card } from "@/components/common/Card";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function BookingPolicy() {
    return (
        <Card className="rounded-xl shadow-sm p-4 cursor-pointer">
            <div className="flex flex-row justify-between">
                <div className="flex gap-2 items-center font-bold">
                    <ShieldCheck className="w-5 text-red-600" />
                    <span>Kebijakan Reschedule & Pembatalan</span>
                </div>
                <ChevronRight className="w-4" />
            </div>
        </Card>
    );
}
