import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import MembershipCardForm from "@/components/Memberships/MembershipCardForm";
import { useCustomerLookup } from "@/features/orders/hooks/useCustomerLookup";
import { renderItemCustomer } from "@/features/orders/utils/CustomerRenderer";

export default function MembershipCardModal({
    show,
    onClose,
    member,
    venueList = [],
    fixedVenueId = null,
    routes = null,
    ...props
}) {
    const isEditMode = !!member;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        _method: isEditMode ? "patch" : "post",
        member_no: "",
        customer_phone: "",
        customer_name: "",
        customer_email: "",
        customer_id: null,
        notes: "",
        venue_id: fixedVenueId || null,
    });

    const {
        suggestions,
        setSuggestions,
        loading,
        banner,
        setBanner,
        isNameReadOnly,
        isEmailReadOnly,
        checkCustomer,
        resetLookup,
        handleSearch,
    } = useCustomerLookup(data.venue_id, isEditMode, setData);

    const venueOptions = venueList.map((v) => ({ value: v.id, label: v.name }));

    useEffect(() => {
        if (show) {
            resetLookup();
            if (isEditMode) {
                setData({
                    _method: "patch",
                    member_no: member?.member_no || "",
                    customer_phone: member?.customer?.phone_number || "",
                    customer_name: member?.name || member?.customer?.name || "",
                    customer_email: member?.customer?.email || "",
                    customer_id: member?.user_id || null,
                    notes: member?.notes || "",
                    venue_id: member?.venue?.id || fixedVenueId,
                });
            } else {
                reset();
                if (fixedVenueId) {
                    setData("venue_id", fixedVenueId);
                }
            }
        }
    }, [show, fixedVenueId]);

    const onPhoneChange = ({ phone }) => {
        setData((prev) => ({
            ...prev,
            customer_phone: phone,
            customer_id: null,
            customer_name: "",
            customer_email: "",
        }));

        if (phone.length === 0) {
            resetLookup();
        } else {
            setBanner(null);
            handleSearch(phone);
        }
    };

    const onEmailChange = (e) => {
        const email = e.target.value;
        setData("customer_email", email);

        if (!isEmailReadOnly && email.includes("@") && email.includes(".")) {
            checkCustomer({ phone: data.customer_phone, email });
        }
    };

    const onSelectSuggestion = (cust) => {
        setSuggestions([]);

        setData((prev) => ({
            ...prev,
            customer_id: cust.user_id,
            customer_phone: cust.phone_number,
            customer_name: cust.name,
            customer_email: cust.email || "",
        }));

        checkCustomer({ phone: cust.phone_number, email: cust.email });
    };

    // Di dalam handleSubmit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (banner?.type === "error") return toast.error(banner.message);

        // Gunakan helper route secara dinamis
        const endpoint = isEditMode
            ? routes?.update ||
              route("merchant.memberships.cards.update", member.slug)
            : routes?.store || route("merchant.memberships.cards.store");

        post(endpoint, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                toast.success(
                    isEditMode ? "Berhasil diperbarui." : "Berhasil dibuat."
                );
            },
            onError: (err) => {
                if (err.card) toast.error(err.card);
            },
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="2xl"
            className="p-4 w-full"
        >
            <MembershipCardForm
                title={isEditMode ? `Edit Member` : "Tambah Member Baru"}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                venueOptions={venueOptions}
                suggestions={suggestions}
                renderItem={renderItemCustomer}
                banner={banner}
                onPhoneChange={onPhoneChange}
                onEmailChange={onEmailChange}
                onSelectSuggestion={onSelectSuggestion}
                isVenueFixed={!!fixedVenueId}
                isPhoneDisabled={
                    isEditMode || (!fixedVenueId && !data.venue_id)
                }
                isNameReadOnly={isEditMode || isNameReadOnly}
                isEmailReadOnly={isEditMode || isEmailReadOnly}
                onClose={onClose}
            />
        </Modal>
    );
}
