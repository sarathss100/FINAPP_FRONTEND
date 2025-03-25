import { Separator } from '@radix-ui/react-separator';
import Image from 'next/image';

const Footer = function () {
    // Footer links data
    const footerSections = [
        {
            title: "Features",
            links: ["Dashboard", "Analytics", "Planning", "Investments"],
        },
        {
          title: "Company",
          links: ["About Us", "Careers", "Blog", "Contact"],
        },
        {
          title: "Legal",
          links: ["Privacy Policy", "Terms of Service", "Security"],
        },
    ];

    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-gray-900 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-4 gap-6 mb-12">
                    <div>
                        <div className="flex items-center mb-4">
                            <Image
                                src="/logo.svg"
                                alt="FinApp Logo"
                                width={30}
                                height={30}
                            />
                            <span className="ml-2 font-normal text-white text-2xl">
                                FinApp
                            </span>
                        </div>
                        <p className="text-gray-400 text-base">
                            Your complete financial management solution
                        </p>
                    </div>

                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white text-lg font-normal mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-gray-400 text-base hover:text-gray-300"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className='bg-white' />

                <div className="pt-8 text-center">
                    <p className="text-gray-400 text-base">
                        © {currentYear} FinApp. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
};

export default Footer;
