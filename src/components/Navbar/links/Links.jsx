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

    links.map(link => {
        console.log(link.path)
        return <Link href={link.path} key={link.title}>{link.title}</Link>;
    })
}

export default Links;