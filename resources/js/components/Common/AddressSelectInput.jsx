import { useState, useEffect } from "react";
import SelectInput from "@/components/Common/SelectInput";
import axios from "axios";

export default function AddressSelectInput({ value = {}, onChange, ...props }) {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    // Fetch provinces
    useEffect(() => {
        axios.get("/api/indonesia/provinces").then((res) => {
            setProvinces(
                res.data.map((p) => ({
                    value: p.code,
                    label: p.name,
                    code: p.code.padStart(2, "0"),
                }))
            );
        });
    }, []);

    // Fetch cities when province changes
    useEffect(() => {
        if (!value.province_code) return setCities([]);

        const province = provinces.find((p) => p.value === value.province_code);
        if (!province) return;

        axios
            .get(`/api/indonesia/cities?province_code=${province.code}`)
            .then((res) => {
                setCities(
                    res.data.map((c) => ({
                        value: c.code,
                        label: c.name,
                        code: c.code.padStart(4, "0"),
                    }))
                );
            });
    }, [value.province_code, provinces]);

    // Fetch districts when city changes
    useEffect(() => {
        if (!value.city_code) return setDistricts([]);

        const city = cities.find((c) => c.value === value.city_code);
        if (!city) return;

        axios
            .get(`/api/indonesia/districts?city_code=${city.code}`)
            .then((res) => {
                setDistricts(
                    res.data.map((d) => ({
                        value: d.code,
                        label: d.name,
                        code: d.code, // tetap 7 karakter
                    }))
                );
            });
    }, [value.city_code, cities]);

    // Fetch villages when district changes
    useEffect(() => {
        if (!value.district_code) return setVillages([]);

        const district = districts.find((d) => d.value === value.district_code);
        if (!district) return;

        axios
            .get(`/api/indonesia/villages?district_code=${district.code}`)
            .then((res) => {
                setVillages(
                    res.data.map((v) => ({
                        value: v.code,
                        label: v.name,
                        code: v.code.padStart(10, "0"), // format frontend agar 10 karakter
                    }))
                );
            });
    }, [value.district_code, districts]);

    return (
        <div className="space-y-2">
            <SelectInput
                options={provinces}
                value={value.province_code || null}
                onChange={(val) =>
                    onChange({
                        ...value,
                        province_code: val,
                        city_code: null,
                        district_code: null,
                        village_code: null,
                    })
                }
                placeholder="Pilih Provinsi..."
                {...props}
            />
            <SelectInput
                options={cities}
                value={value.city_code || null}
                onChange={(val) =>
                    onChange({
                        ...value,
                        city_code: val,
                        district_code: null,
                        village_code: null,
                    })
                }
                placeholder="Pilih Kota/Kabupaten..."
                isDisabled={!value.province_code}
                {...props}
            />
            <SelectInput
                options={districts}
                value={value.district_code || null}
                onChange={(val) =>
                    onChange({
                        ...value,
                        district_code: val,
                        village_code: null,
                    })
                }
                placeholder="Pilih Kecamatan..."
                isDisabled={!value.city_code}
                {...props}
            />
            <SelectInput
                options={villages}
                value={value.village_code || null}
                onChange={(val) =>
                    onChange({
                        ...value,
                        village_code: val,
                    })
                }
                placeholder="Pilih Desa/Kelurahan..."
                isDisabled={!value.district_code}
                {...props}
            />
        </div>
    );
}
