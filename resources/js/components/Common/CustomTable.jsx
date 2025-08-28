import { twMerge } from "tailwind-merge";
import Button from "@/components/Common/Button";
import { Card } from "@/components/Common/Card";

export default function CustomTable({
    title,
    rows = [],
    showEdit = false,
    onEditClick,
    className = "",
    valueTdClassName = "break-normal",
}) {
    return (
        <Card className={twMerge("border-none shadow-none p-1", className)}>
            <table className="border border-collapse  border-secondary-200 dark:border-secondary-600 w-full">
                <thead className="bg-secondary-100">
                    <tr>
                        <th
                            colSpan={3}
                            className="w-2/5 py-4 px-2 uppercase text-left"
                        >
                            {title}
                        </th>
                        {/* {showEdit && (
                            <td className="text-right">
                                <Button
                                    variant="success"
                                    className="mx-2 text-xs"
                                    onClick={onEditClick}
                                >
                                    Edit
                                </Button>
                            </td>
                        )} */}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <th className="border border-secondary-200 dark:border-secondary-600 p-2 text-left">
                                {row.label}
                            </th>
                            <td className="border border-secondary-200 dark:border-secondary-600 p-1 text-center">
                                :
                            </td>
                            <td
                                className={twMerge(
                                    "border border-secondary-200 dark:border-secondary-600 p-2 text-left",
                                    valueTdClassName,
                                    row.valueTdClassName
                                )}
                            >
                                {row.value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}
