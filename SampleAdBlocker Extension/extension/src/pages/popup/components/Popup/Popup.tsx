import React from 'react';

import './popup.pcss';

export const Popup = () => {
    const handleBlock = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        console.log('launch assistant');
    };

    return (
        <div className="popup">
            <div>Popup</div>
            <a href="#" onClick={handleBlock}>Block ads on this website</a>
        </div>
    );
};
