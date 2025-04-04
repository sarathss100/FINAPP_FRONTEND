import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = () => {
            // Check for the Clear-Storage header in the response
            const clearStorageHeader = document.querySelector('meta[name="clear-storage"]');
            if (clearStorageHeader) {
                // Clear localStorage and sessionStorage
                localStorage.clear();
                sessionStorage.clear();
            }
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    return <Component {...pageProps} />;
}

export default MyApp;
