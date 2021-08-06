import React from 'react';

import './action.pcss';

interface ActionProps {
    icon: string,
    title: string,
    description?: string,
}

export const Action = ({ icon, title, description = undefined }: ActionProps) => {
    return (
        <div className="action">
            <div className="icon">{icon}</div>
            <div className="action-details">
                <div className="action-title">{title}</div>
                <div className="action-description">{description}</div>
            </div>
        </div>
    );
};
