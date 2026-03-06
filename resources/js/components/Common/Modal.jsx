import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

export default function Modal({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
    className = "",
    sidebarRight = false,
    overflow = "auto",
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        xs: "sm:max-w-xs",
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
        "3xl": "sm:max-w-3xl",
        "4xl": "sm:max-w-4xl",
        "5xl": "sm:max-w-5xl",
        "6xl": "sm:max-w-6xl",
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-modal overflow-y-auto" // Hilangkan flex di sini
                onClose={close}
            >
                <div
                    className={twMerge(
                        "flex min-h-full px-4 py-6 sm:px-0 items-center justify-center", // items-center di sini tetap oke
                        sidebarRight ? "p-0" : "p-4"
                    )}
                >
                    {/* Backdrop */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 transition-opacity" />
                    </Transition.Child>

                    {/* Modal Panel */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <Dialog.Panel
                            className={twMerge(
                                "relative bg-white dark:bg-secondary-900 dark:border dark:border-secondary-600 rounded-xl shadow-xl transform transition-all w-full sm:mx-auto text-left",

                                sidebarRight
                                    ? "fixed inset-y-0 right-0 h-full max-w-full rounded-none overflow-y-auto"
                                    : `my-8 overflow-${overflow}`,
                                maxWidthClass,
                                className
                            )}
                        >
                            <div className="text-secondary-900 dark:text-secondary-100">
                                {children}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
