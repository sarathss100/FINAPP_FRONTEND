import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
    useEffect(() => {
        // Check for the custom header in the response
        const clearStorageHeader = document.querySelector('meta[name="clear-storage"]');
        if (clearStorageHeader) {
            // Clear localStorage and sessionStorage
            localStorage.clear();
            sessionStorage.clear();
        }
    }, []);

    return <Component {...pageProps} />
}
