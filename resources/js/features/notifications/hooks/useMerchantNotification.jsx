import { useState, useMemo } from "react";
import { router, usePage } from "@inertiajs/react";

export const useMerchantNotification = () => {
    const { notification_list } = usePage().props;

    const notifications = notification_list?.data || [];

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [activeCategory, setActiveCategory] = useState("transactions");
    const [subFilter, setSubFilter] = useState("all_updates");
    const [transSubFilter, setTransSubFilter] = useState("all_transactions");
    const [confirmDelete, setConfirmDelete] = useState({
        show: false,
        id: null,
    });

    const hasUnread = useMemo(
        () => notifications.some((n) => !n.is_read),
        [notifications],
    );

    const filteredNotifications = useMemo(() => {
        const filtered = notifications.filter((n) => {
            const subCat = n.data?.sub_category;
            if (activeCategory === "transactions") {
                if (n.category !== "transaction") return false;
                if (transSubFilter === "all_transactions") return true;
                return subCat === transSubFilter;
            }
            if (activeCategory === "updates") {
                const updateCategories = ["promo", "info", "account"];
                if (!updateCategories.includes(n.category)) return false;
                if (subFilter === "all_updates") return true;
                return n.category === subFilter;
            }
            return true;
        });

        return [...filtered].sort((a, b) => {
            if (a.is_pinned !== b.is_pinned) {
                return a.is_pinned ? -1 : 1;
            }

            return new Date(b.created_at) - new Date(a.created_at);
        });
    }, [notifications, activeCategory, subFilter, transSubFilter]);

    const bulkPinStatus = useMemo(() => {
        const selectedItems = filteredNotifications.filter((n) =>
            selectedNotifications.includes(n.id),
        );

        return {
            allPinned:
                selectedItems.length > 0 &&
                selectedItems.every((n) => n.is_pinned),
            anyPinned: selectedItems.some((n) => n.is_pinned),
            count: selectedItems.length,
        };
    }, [filteredNotifications, selectedNotifications]);

    const getCount = (filterId) => {
        const isUnread = (n) => !n.is_read;

        if (filterId === "updates" || filterId === "all_updates") {
            return notifications.filter(
                (n) =>
                    ["promo", "info", "account"].includes(n.category) &&
                    isUnread(n),
            ).length;
        }

        if (filterId === "transactions" || filterId === "all_transactions") {
            return notifications.filter(
                (n) => n.category === "transaction" && isUnread(n),
            ).length;
        }

        const countBySubCategory = notifications.filter(
            (n) =>
                n.category === "transaction" &&
                n.data?.sub_category === filterId &&
                isUnread(n),
        ).length;

        if (countBySubCategory > 0) return countBySubCategory;

        return notifications.filter(
            (n) => n.category === filterId && isUnread(n),
        ).length;
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedNotifications(filteredNotifications.map((n) => n.id));
        } else {
            setSelectedNotifications([]);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedNotifications((prev) =>
            prev.includes(id)
                ? prev.filter((nid) => nid !== id)
                : [...prev, id],
        );
    };

    const applyAction = (action, id = null) => {
        const idsToProcess = id ? [id] : selectedNotifications;
        if (idsToProcess.length === 0) return;

        setIsProcessing(true);
        router.post(
            route("merchant.notifications.bulkAction"),
            { ids: idsToProcess, action },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (!id) setSelectedNotifications([]);
                    setConfirmDelete({ show: false, id: null });
                },
                onFinish: () => setIsProcessing(false),
            },
        );
    };

    const handleMarkAllRead = () => {
        setIsProcessing(true);

        const payload = {
            category: activeCategory,
            sub_filter:
                activeCategory === "transactions" ? transSubFilter : subFilter,
        };

        router.post(route("merchant.notifications.markAllRead"), payload, {
            preserveScroll: true,
            onFinish: () => setIsProcessing(false),
        });
    };

    const handleNotificationClick = (id) => {
        if (isProcessing) return;
        router.post(route("merchant.notifications.markAsRead", id));
    };

    const confirmAction = (id = null) => setConfirmDelete({ show: true, id });
    const closeDeleteModal = () =>
        !isProcessing && setConfirmDelete({ show: false, id: null });

    return {
        notifications,
        isProcessing,
        selectedNotifications,
        activeCategory,
        subFilter,
        transSubFilter,
        confirmDelete,
        setActiveCategory,
        setSubFilter,
        setTransSubFilter,
        filteredNotifications,
        hasUnread,
        bulkPinStatus,
        getCount,
        toggleSelectAll,
        toggleSelectOne,
        applyAction,
        handleMarkAllRead,
        handleNotificationClick,
        confirmAction,
        closeDeleteModal,
    };
};
