import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import MembershipPackageForm from "@/Pages/Merchant/Membership/MembershipPackage/Partials/MembershipPackageForm";

export default function Edit({ show, onClose, venue, fetchVenues, pkg }) {
    const { data, setData, put, processing, errors, reset } = useForm({
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
    });

    const [selectedBenefits, setSelectedBenefits] = useState([]);

    // isi data ketika pkg berubah dan modal dibuka
    useEffect(() => {
        if (pkg && show) {
            setData({
                package_name: pkg.name || "",
                package_duration_months: pkg.duration_months || "",
                package_price: pkg.price || "",
                package_descriptions: pkg.description || "",
                discount_name: pkg.discounts?.[0]?.name || null,
                discount_type: pkg.discounts?.[0]?.discount_type || null,
                discount_value: pkg.discounts?.[0]?.discount_value || null,
                discount_limit: pkg.discounts?.[0]?.discount_limit || null,
                discount_descriptions: pkg.discounts?.[0]?.description || null,
                other_name: pkg.others?.[0]?.name || null,
                other_descriptions: pkg.others?.[0]?.description || null,
            });

            const benefits = [];
            if (pkg.discounts?.length) benefits.push("discount");
            if (pkg.others?.length) benefits.push("other");
            setSelectedBenefits(benefits);
        }
    }, [pkg, show]);

    // reset ketika modal ditutup
    useEffect(() => {
        if (!show) {
            reset();
            setSelectedBenefits([]);
        }
    }, [show]);

    const handleSubmit = (e) => {
        e.preventDefault();

        put(
            route("merchant.memberships.packages.update", {
                venue: venue.id,
                membershipPackages: pkg.slug,
            }),
            {
                data,
                onSuccess: () => {
                    toast.success(
                        `Paket "${data.package_name}" berhasil diperbarui`
                    );
                    if (fetchVenues) fetchVenues();
                    onClose();
                },
                onError: () => {
                    if (Object.keys(errors).length > 0) {
                        toast.error("Oops! Sepertinya ada yang belum diisi 😅");
                    } else {
                        toast.error(
                            `Gagal memperbarui paket "${data.package_name}"`
                        );
                    }
                },
            }
        );
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl" className="p-4">
            <MembershipPackageForm
                data={data}
                setData={setData}
                selectedBenefits={selectedBenefits}
                setSelectedBenefits={setSelectedBenefits}
                onClose={onClose}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                title="Perbarui Paket Keanggotaan"
                mode="edit"
            />
        </Modal>
    );
}
