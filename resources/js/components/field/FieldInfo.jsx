import { tv } from "tailwind-variants";

const fieldInfo = tv({
    base: "space-y-4",
});

export default function FieldInfo({
    name,
    rating,
    description,
    field_type,
    className,
}) {
    return (
        <div className={fieldInfo({ class: className })}>
            <div className="text-4xl font-bold">{name}</div>

            {rating && <div>{rating} ★</div>}

            <div>
                <span className="font-semibold">Tipe Lapangan: </span>
                <span>{field_type}</span>
            </div>

            <div>
                <span className="font-semibold">Deskripsi</span>
                <p>{description}</p>
            </div>
        </div>
    );
}
