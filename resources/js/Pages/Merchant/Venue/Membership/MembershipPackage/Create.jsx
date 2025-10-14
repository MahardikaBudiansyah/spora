import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import MembershipPackageForm from "@/Pages/Merchant/Membership/MembershipPackage/Partials/MembershipPackageForm";

export default function Create({ show, onClose, venue, fetchPackages }) {
    const [selectedBenefits, setSelectedBenefits] = useState([]);
    const { data, setData, post, processing, errors, reset } = useForm({
        package_name: "",
        package_duration_months: "",
        package_price: "",
        package_descriptions: "",
        discount_name: null,
        discount_type: null,
        discount_value: null,
        discount_limit: null,
        discount_descriptions: null,
        other_name: null,
        other_descriptions: null,
        venue_id: venue?.id || null,
    });

    useEffect(() => {
        if (!show) {
            reset();
            setData("venue_id", venue?.id || null);
            setSelectedBenefits([]);
        }
    }, [show]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(
            route("merchant.venues.memberships.packages.store", {
                venue: venue.slug,
            }),
            {
                onSuccess: () => {
                    toast.success(
                        `Paket "${data.package_name}" berhasil ditambahkan`
                    );
                    reset();
                    setSelectedBenefits([]);
                    if (fetchPackages) fetchPackages();
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal menambahkan paket 😅");
                },
            }
        );
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl" className="p-4">
            <MembershipPackageForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Tambah Paket Keanggotaan (Venue)"
                mode="create"
                selectedBenefits={selectedBenefits}
                setSelectedBenefits={setSelectedBenefits}
                onClose={onClose}
            />
        </Modal>
    );
}
