import { useState, useEffect, useRef } from "react";
import SelectInput from "@/components/Common/SelectInput";
import axios from "axios";

export default function AddressSelectInput({ value = {}, onChange, ...props }) {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    const fetchingRef = useRef(new Set());

    const fetchLocation = async (url, setter, type) => {
        try {
            const res = await axios.get(url);
            const mapped = res.data.map((item) => ({
                value: item.code,
                label: item.name,
                code: item.code,
            }));
            setter(mapped);
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        }
    };

    useEffect(() => {
        fetchLocation("/api/indonesia/provinces", setProvinces, "provinces");
    }, []);

    useEffect(() => {
        if (value.province_code) {
            const pCode = value.province_code.substring(0, 2);
            fetchLocation(
                `/api/indonesia/cities?province_code=${pCode}`,
                setCities,
                "cities"
            );
        } else {
            setCities([]);
        }

        if (value.city_code) {
            const cCode = value.city_code.substring(0, 4);
            fetchLocation(
                `/api/indonesia/districts?city_code=${cCode}`,
                setDistricts,
                "districts"
            );
        } else {
            setDistricts([]);
        }

        if (value.district_code) {
            const dCode = value.district_code.substring(0, 7);
            fetchLocation(
                `/api/indonesia/villages?district_code=${dCode}`,
                setVillages,
                "villages"
            );
        } else {
            setVillages([]);
        }
    }, [value.province_code, value.city_code, value.district_code]);

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
                placeholder={
                    value.province_code
                        ? "Pilih Kota/Kabupaten..."
                        : "Pilih Provinsi Terlebih Dahulu"
                }
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
                placeholder={
                    value.city_code
                        ? "Pilih Kecamatan..."
                        : "Pilih Kota Terlebih Dahulu"
                }
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
                placeholder={
                    value.district_code
                        ? "Pilih Desa/Kelurahan..."
                        : "Pilih Kecamatan Terlebih Dahulu"
                }
                isDisabled={!value.district_code}
                {...props}
            />
        </div>
    );
}
