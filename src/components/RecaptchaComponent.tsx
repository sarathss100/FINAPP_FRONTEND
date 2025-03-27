import { RecaptchaVerifier } from 'firebase/auth'
import { useEffect, useRef } from 'react'
import auth from '../lib/firebaseConfig';
import IRecaptchaComponentProps from '../types/IRecaptchaComponentProps';

const RecaptchaComponent = function ({ onRecaptchaInit }: IRecaptchaComponentProps ) {
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

    useEffect(() => {
        // Initialize reCAPTCH verifier
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: 'invisible',
            callback: (response: Response) => {
                console.log(`reCAPTCHA solved:`, response);
            },
            'expired-callback': () => {
                console.log(`reCAPTCHA expired`);
            }
        });

        // Pass the intialized recaptchaVerifier to the parent componet
        onRecaptchaInit(recaptchaVerifierRef.current as RecaptchaVerifier);

        // cleanup function
        return () => {
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
            }
        }
    }, []);

    return (
        <div>
            {/* reCAPTCHA container */}
            <div id="recaptcha-container" style={{ display: 'none' }}></div>
        </div>
    )
}

export default RecaptchaComponent;
