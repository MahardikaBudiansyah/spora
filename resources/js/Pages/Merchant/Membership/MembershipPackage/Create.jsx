import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import MembershipPackageForm from "@/Pages/Merchant/Membership/MembershipPackage/Partials/MembershipPackageForm";

export default function Create({ show, onClose, venue, fetchVenues }) {
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
        venue_id: null,
    });

    // isi venue_id ketika modal dibuka
    useEffect(() => {
        if (venue && show) {
            setData("venue_id", venue.id);
        }
    }, [venue, show]);

    // reset hanya ketika modal ditutup
    useEffect(() => {
        if (!show) {
            reset();
            setData("venue_id", venue?.id ?? null);
            setSelectedBenefits([]);
        }
    }, [show]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("merchant.memberships.packages.store"), {
            onSuccess: () => {
                if (fetchVenues) fetchVenues();
                reset();
                setData("venue_id", venue?.id ?? null);
                onClose();
                toast.success(
                    `Paket "${data.package_name}" berhasil ditambahkan`
                );
            },
            onError: () => {
                if (Object.keys(errors).length > 0) {
                    toast.error("Oops! Sepertinya ada yang belum diisi 😅");
                } else {
                    toast.error(
                        `Gagal menambahkan paket "${data.package_name}"`
                    );
                }
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl" className="p-4">
            <MembershipPackageForm
                data={data}
                setData={setData}
                onClose={onClose}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Tambah Paket Keanggotaan"
                mode="create"
                selectedBenefits={selectedBenefits}
                setSelectedBenefits={setSelectedBenefits}
            />
        </Modal>
    );
}
