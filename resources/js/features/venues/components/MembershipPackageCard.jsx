import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import {
    CheckCircle,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    Tag,
} from "lucide-react";
import Tippy from "@tippyjs/react";
import { formatDiscount, formatRupiah } from "@/utils/currency";

export default function MembershipPackageCard({
    pkg,
    onBuy,
    buttonText = "Beli",
    isSelected = false,
    isExpanded = false,
    onToggleExpand = () => {},
}) {
    const discounts = pkg?.discounts || [];
    const others = pkg?.others || [];

    const hasDiscounts = discounts.length > 0;
    const hasOthers = others.length > 0;

    return (
        <Card
            className={`flex flex-col h-full p-2 rounded-lg shadow-sm border dark:border-none ${
                isSelected
                    ? "border-secondary-300 bg-secondary-50 dark:border-secondary-800 dark:bg-secondary-700"
                    : "border-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-900/80"
            }`}
        >
            <CardHeader className="border-none flex flex-col gap-1 p-4">
                <div
                    onClick={onToggleExpand}
                    aria-label="Toggle Description"
                    className="flex items-start justify-between group cursor-pointer"
                >
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-secondary-900 dark:text-white">
                            {pkg.name}
                        </h4>
                        <div className="flex items-center gap-2 text-secondary-500 dark:text-secondary-400 font-semibold text-xs">
                            <Tag className="w-3.5 h-3.5" />
                            Durasi {pkg.duration_months} Bulan
                        </div>
                    </div>

                    <button type="button" className="p-1  rounded">
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-secondary-400 dark:text-secondary-300 hover:text-secondary-600 dark:hover:text-secondary-100" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-secondary-400 dark:text-secondary-300 hover:text-secondary-600 dark:hover:text-secondary-100" />
                        )}
                    </button>
                </div>

                {isExpanded && pkg.description && (
                    <p className="text-left text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed italic ">
                        "{pkg.description}"
                    </p>
                )}
            </CardHeader>

            <CardBody className="flex-1 py-1">
                {(hasDiscounts || hasOthers) && (
                    <ul
                        className={`space-y-2 p-3 rounded-lg ${
                            isSelected
                                ? "bg-secondary-200 dark:bg-secondary-800/40"
                                : "bg-secondary-50 dark:bg-secondary-800"
                        }`}
                    >
                        {discounts.map((discount, index) => (
                            <li
                                key={index}
                                className="flex gap-2 items-start justify-between text-[11px] md:text-xs"
                            >
                                <div className="flex gap-2 items-start text-left">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-secondary-700 dark:text-secondary-300">
                                        Diskon{" "}
                                        {formatDiscount(
                                            discount.discount_type,
                                            discount.discount_value
                                        )}
                                        {discount.discount_limit &&
                                            ` (Maks ${discount.discount_limit} jam)`}
                                    </span>
                                </div>

                                {discount.description && (
                                    <Tippy content={discount.description}>
                                        <HelpCircle className="w-3.5 h-3.5 text-secondary-400 cursor-help ml-2 flex-shrink-0" />
                                    </Tippy>
                                )}
                            </li>
                        ))}

                        {others.map((other, index) => (
                            <li
                                key={index}
                                className="flex gap-2 items-start justify-between text-[11px] md:text-xs"
                            >
                                <div className="flex gap-2 items-start text-left">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-secondary-700 dark:text-secondary-300">
                                        {other.name}
                                    </span>
                                </div>

                                {other.description && (
                                    <Tippy content={other.description}>
                                        <HelpCircle className="w-3.5 h-3.5 text-secondary-400 cursor-help ml-2" />
                                    </Tippy>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </CardBody>

            <CardFooter className="flex justify-between items-end border-none">
                <div className="flex gap-1 items-end">
                    <span className="text-lg font-bold">
                        {formatRupiah(pkg.price)}
                    </span>
                </div>

                {buttonText && (
                    <Button
                        type="button"
                        variant="primary"
                        size="xs"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBuy();
                        }}
                    >
                        {isSelected ? "Terpilih" : buttonText}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
