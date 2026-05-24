import InputLabel from "@/components/common/LabelInput";
import TextInput from "@/components/common/TextInput";
import SelectInput from "@/components/common/SelectInput";
import InputError from "@/components/common/ErrorInput";
import { Trash2, Star } from "lucide-react";
import { Card } from "@/components/Common/Card";
import LabelInput from "@/components/common/LabelInput";
import TextArea from "@/components/Common/TextArea";
import Checkbox from "@/components/Common/Checkbox";
import Badge from "@/components/Common/Badge";
import IconButton from "@/components/Common/IconButton";

export default function CourtCategoryManager({
    categories,
    selectedCategories = [],
    setData,
    errors,
}) {
    const handleAddCategory = (id) => {
        if (!id) return;
        const categoryData = categories.find((c) => c.id === Number(id));

        const newEntry = {
            id: categoryData.id,
            name: categoryData.name,
            label: categoryData.label,
            is_primary: selectedCategories.length === 0 ? 1 : 0,
            notes: "",
            order: selectedCategories.length + 1,
        };

        setData("categories", [...selectedCategories, newEntry]);
    };

    const handleUpdateCourt = (id, court_categories, value) => {
        const updated = selectedCategories.map((item) => {
            if (item.id === id) {
                return { ...item, [court_categories]: value };
            }
            if (court_categories === "is_primary" && item.id !== id) {
                return { ...item, is_primary: false };
            }
            return item;
        });
        setData("categories", updated);
    };

    const handleRemove = (id) => {
        const filtered = selectedCategories.filter((item) => item.id !== id);

        if (filtered.length > 0 && !filtered.find((c) => c.is_primary)) {
            filtered[0].is_primary = true;
        }
        setData("categories", filtered);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2 lg:w-1/2">
                <SelectInput
                    placeholder="Tambah kategori (Futsal, Basket, dll...)"
                    options={categories
                        .filter(
                            (cat) =>
                                !selectedCategories.find(
                                    (s) => s.id === cat.id,
                                ),
                        )
                        .map((cat) => ({ label: cat.label, value: cat.id }))}
                    onChange={handleAddCategory}
                    value=""
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
                {selectedCategories.map((item) => (
                    <Card
                        key={item.id}
                        className="p-4 border rounded-md shadow-none space-y-2"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                    {item.label}
                                </span>
                                {Boolean(item.is_primary) && (
                                    <Badge color="green" className="flex gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        Utama
                                    </Badge>
                                )}
                            </div>
                            <IconButton
                                variant="ghost"
                                onClick={() => handleRemove(item.id)}
                                className="text-red-500 hover:bg-red-50 p-1.5 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </IconButton>
                        </div>

                        <div className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={item.is_primary}
                                onChange={() =>
                                    handleUpdateCourt(
                                        item.id,
                                        "is_primary",
                                        true,
                                    )
                                }
                            />
                            <span className="text-xs">Kategori Utama</span>
                        </div>

                        <div className="space-y-1">
                            <LabelInput
                                value="Catatan:"
                                className="text-xs font-bold"
                            />
                            <TextArea
                                placeholder="Contoh: Ring tersedia"
                                className="text-xs h-full"
                                value={item.notes ?? ""}
                                onChange={(e) =>
                                    handleUpdateCourt(
                                        item.id,
                                        "notes",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </Card>
                ))}
            </div>
            {errors.categories && <InputError message={errors.categories} />}
        </div>
    );
}
