import { Card, CardHeader, CardBody } from "@/components/common/Card";
import Avatar from "@/components/Common/Avatar";
import { formatTo08 } from "@/utils/numberPhone";

export default function CustomerData({ user }) {
    const getInitials = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        return words
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Card className="rounded-xl dark:border-none shadow-sm p-4">
            <CardHeader className="pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white">
                Penyewa
            </CardHeader>
            <CardBody>
                <div className="py-2 flex flex-row items-start gap-3">
                    <Avatar
                        src={user.photo || ""}
                        fallback={getInitials(user.name)}
                        size="xl"
                        className="mt-1"
                    />
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col  ">
                            <span className="text-lg font-bold">
                                {user.name}
                            </span>
                            <span>{user.email}</span>
                            <span>{formatTo08(user.phone_number)}</span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
