import { useEffect } from 'react';

const useClickOutside = function (ref: React.RefObject<HTMLDivElement | null>, callback: () => void) {
    useEffect(() => {
        const handleClickOutside = function (event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(); // Trigger the callback when clicking outside
            }
        };

        // Attach event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
}

export default useClickOutside;
