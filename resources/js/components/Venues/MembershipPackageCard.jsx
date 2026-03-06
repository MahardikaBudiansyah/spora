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
            className={`flex flex-col h-full p-3 rounded-lg shadow-sm border dark:border-none transition ${
                isSelected
                    ? "border-primary-300 bg-primary-100 dark:border-secondary-800 dark:bg-secondary-700"
                    : "border-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-900/80"
            }`}
        >
            <CardHeader className="border-none flex flex-col gap-1 p-4">
                <div className="flex items-center justify-between w-full">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {pkg.name}
                    </h3>

                    {pkg.description && (
                        <button
                            onClick={onToggleExpand}
                            className="ml-2"
                            aria-label="Toggle Description"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    )}
                </div>

                {isExpanded && pkg.description && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed animate-in fade-in slide-in-from-top-1">
                        {pkg.description}
                    </div>
                )}
            </CardHeader>

            <CardBody className="flex-1">
                {(hasDiscounts || hasOthers) && (
                    <ul className="flex flex-col gap-2 items-start text-xs mb-3">
                        {discounts.map((discount, index) => (
                            <li
                                key={index}
                                className="flex justify-between w-full"
                            >
                                <div className="flex gap-2 items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="leading-tight">
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
                                        <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help ml-2 flex-shrink-0" />
                                    </Tippy>
                                )}
                            </li>
                        ))}

                        {others.map((other, index) => (
                            <li
                                key={index}
                                className="flex justify-between w-full"
                            >
                                <div className="flex gap-2 items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span>{other.name}</span>
                                </div>

                                {other.description && (
                                    <Tippy content={other.description}>
                                        <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help ml-2" />
                                    </Tippy>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </CardBody>

            <CardFooter className="flex justify-between items-end border-none">
                <div className="flex gap-1 items-end">
                    <span className="text-base font-bold">
                        {formatRupiah(pkg.price)}/
                    </span>
                    <span>{pkg.duration_months} Bulan</span>
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
