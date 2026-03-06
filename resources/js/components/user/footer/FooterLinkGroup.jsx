export default function FooterLinkGroup({ title, links }) {
    return (
        <div>
            <h2 className="mb-4 text-sm font-semibold text-secondary-900 uppercase dark:text-white">
                {title}
            </h2>
            <ul className="text-secondary-700 dark:text-secondary-400">
                {links.map((link, i) => (
                    <li key={i} className="mb-2 outline-none">
                        <a
                            href={link.href}
                            className="hover:text-primary-500 hover:font-semibold dark:hover:text-secondary-100 outline-none focus-visible:text-primary-500 focus-visible:font-semibold dark:focus-visible:text-primary-400"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
