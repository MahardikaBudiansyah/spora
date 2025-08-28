import { tv } from "tailwind-variants";

const venueInfo = tv({
    base: "space-y-4",
});

export default function VenueInfo({
    name,
    rating,
    description,
    phone_number,
    className,
}) {
    return (
        <div className={venueInfo({ class: className })}>
            <div className="text-4xl font-bold">{name}</div>

            {rating && <div>{rating} ★</div>}

            <div>
                <span className="font-semibold text-sm">Deskripsi</span>
                <p>{description}</p>
            </div>

            <div>
                <span className="font-semibold">Nomor Telepon: </span>
                <span>{phone_number}</span>
            </div>
        </div>
    );
}
