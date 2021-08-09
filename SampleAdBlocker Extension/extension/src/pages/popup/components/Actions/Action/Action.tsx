/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react';

import Icon, { IconType } from '../../ui/Icon';

import './action.pcss';

interface ActionProps {
    icon: IconType,
    title: string,
    description?: string,
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => Promise<void>,
}

export const Action = ({
    icon,
    title,
    description,
    onClick,
}: ActionProps) => {
    return (
        <div className="action" onClick={onClick}>
            <Icon className="icon" icon={icon} />
            <div className="action-details">
                <div className="action-title">{title}</div>
                <div className="action-description">{description}</div>
            </div>
        </div>
    );
};
