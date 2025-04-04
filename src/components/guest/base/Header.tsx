import Button from '@/components/base/Button';
import Image from 'next/image';
import Link from 'next/link';

const Header = function ({ isSignupPage }: { isSignupPage: boolean }) {

    // Navigation links data
    const navLinks = [
        { name: "Features", href: '#' },
        { name: "Dashboard", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Contact", href: "#" },
    ];

    return (
        <header className="w-full h-16 bg-white shadow-sm">
            <div className="container mx-auto h-full px-6">
                <div className="flex items-center justify-between h-full">
                    <Link
                        href={'/'}
                        passHref
                    >
                        <div className="flex items-center justify-between h-full">
                        <Image src="/logo.svg" alt="FinApp Logo" width={30} height={30} />
                        <span className="ml-2 font-normal text-[#004a7c] text-2xl">FinApp</span>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="font-normal text-gray-600 text-base"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Dynamic Button */}
                    <Link
                        href={isSignupPage ? '/login' : '/signup'}
                        passHref
                    >
                        <Button className="bg-[#004a7c] text-white rounded-full px-6 flex items-center">
                            <Image src='/user.svg' alt='Sign In Icon' width={14} height={16} className='mr-2' />
                            { isSignupPage ? `Sign In` : `Sign Up`}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
};

export default Header;
