import Link from "next/link";

const Links = () => {

    const links = [
        {
            'title': 'About',
            'path': '/about'
        },
        {
            'title': 'Contact',
            'path': '/contact'
        }
    ];

    return links.map(link => {
        <Link href={link.path} key={link.title}>{link.title}</Link>
    })
}

export default Links;