export default function FooterLinkGroup({ title, links }) {
    return (
        <div>
            <h2 className="mb-4 text-sm font-semibold text-secondary-900 uppercase dark:text-white">
                {title}
            </h2>
            <ul className="text-secondary-700 dark:text-secondary-400">
                {links.map((link, i) => (
                    <li key={i} className="mb-2">
                        <a
                            href={link.href}
                            className="hover:text-secondary-800 hover:font-semibold dark:hover:text-white"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
