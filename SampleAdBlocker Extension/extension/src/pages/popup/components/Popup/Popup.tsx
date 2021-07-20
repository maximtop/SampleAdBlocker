/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */
import React from 'react';

export const Popup = () => {
    const handleBlock = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        console.log('launch assistant');
    };

    return (
        <div>
            <div>Popup</div>
            <div role="button" onClick={handleBlock}>Block ads on this website</div>
        </div>
    );
};
