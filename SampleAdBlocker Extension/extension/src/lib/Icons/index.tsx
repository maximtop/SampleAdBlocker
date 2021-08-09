import React from 'react';
import './icons.pcss';

export type IconType =
    'delete' |
    'aim' |
    'compass';

const Icons = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icons">
        <symbol id="delete" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M7 9H17L16.2367 19.0755C16.1972 19.597 15.7625 20 15.2396 20H8.76044C8.23746 20 7.80281 19.597 7.7633 19.0755L7 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6.5H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 6V4L10 4V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd" d="M13.5 12V17V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd" d="M10.5 12V17V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="aim" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.9997 9.27271C10.4935 9.27271 9.27246 10.4937 9.27246 12C9.27246 13.5062 10.4935 14.7273 11.9997 14.7273C13.506 14.7273 14.727 13.5062 14.727 12C14.7252 10.4945 13.5052 9.27447 11.9997 9.27271Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C20.9942 7.03185 16.9682 3.00581 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 18V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="compass" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 15L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M11 11L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12.5 10.5L13.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10.5 12.5L11.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </symbol>
    </svg>
);

export default Icons;
