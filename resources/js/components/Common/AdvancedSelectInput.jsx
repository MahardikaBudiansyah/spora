import Select from "react-select";

export default function AdvancedSelectInput({
    id,
    name,
    value,
    onChange,
    options = [],
    className = "",
    isClearable = false,
    isSearchable = true,
    placeholder = "Pilih...", // default placeholder
    ...props
}) {
    const selectedOption = options.find((opt) => opt.value === value) || null;

    return (
        <Select
            inputId={id}
            name={name}
            value={selectedOption}
            onChange={(option) => {
                onChange(option ? option.value : "");
            }}
            options={options}
            isClearable={isClearable}
            isSearchable={isSearchable}
            placeholder={placeholder}
            styles={{
                control: (base, state) => ({
                    ...base,
                    backgroundColor: "white",
                    borderColor: state.isFocused ? "#06b6d4" : "#d6d3d1",
                    boxShadow: state.isFocused ? "0 0 0 1px #06b6d4" : "none",
                    "&:hover": { borderColor: "#06b6d4" },
                    fontSize: "0.875rem",
                }),
                placeholder: (base) => ({
                    ...base,
                    color: "#a8a29e",
                    textAlign: "left",
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#67e8f9" : "white",
                    color: "#111827",
                    fontSize: "0.875rem",
                    textAlign: "left",
                }),
            }}
            className={className}
            classNamePrefix="react-select"
            {...props}
        />
    );
}
