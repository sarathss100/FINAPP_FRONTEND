import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = function (...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default cn;
