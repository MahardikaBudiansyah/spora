import { Card, CardBody, CardHeader } from "@/components/common/Card";

export default function StepCard({
    title,
    icon: Icon,
    children,
    badge,
    className = "",
}) {
    return (
        <Card className={`text-left ${className}`}>
            {/* Header Area */}
            <CardHeader className="flex items-center justify-between bg-secondary-50/30 dark:bg-secondary-800/50">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/40 rounded-lg text-primary-600 dark:text-primary-400">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                    <h3 className="text-sm font-bold uppercase tracking-widest text-secondary-600 dark:text-secondary-300">
                        {title}
                    </h3>
                </div>
                {badge && <div className="ml-2">{badge}</div>}
            </CardHeader>

            <CardBody className="p-6">{children}</CardBody>
        </Card>
    );
}
