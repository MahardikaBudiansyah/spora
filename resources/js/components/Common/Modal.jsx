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
    sidebarRight = false, // tambahkan prop ini
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
                className={twMerge(
                    "fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center justify-center z-50 transform transition-all"
                )}
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className={twMerge(
                            "absolute inset-0 bg-black/50",
                            sidebarRight && "rounded-none"
                        )}
                    />
                </Transition.Child>

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
                            "mb-6 bg-white dark:bg-secondary-900 dark:border dark:border-secondary-600 rounded-xl overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto",
                            maxWidthClass,
                            sidebarRight
                                ? "rounded-none h-full max-h-[calc(100vh)] fixed inset-y-0 right-0 overflow-y-auto custom-scrollbar"
                                : "",
                            className
                        )}
                    >
                        <div className="text-secondary-900 dark:text-secondary-100">
                            {children}
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
