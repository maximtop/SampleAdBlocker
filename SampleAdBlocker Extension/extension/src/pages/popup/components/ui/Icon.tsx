import React from 'react';
import cn from 'classnames';
import { IconType } from '../../../../lib/Icons';

interface IconProps {
    icon: IconType;
    className?: string;
    color?: string;
}

const Icon = ({ icon, className, color }: IconProps) => {
    const iconClass = cn('icon', `icon--${color}`, className);

    return (
        <svg className={iconClass}>
            <use xlinkHref={`#${icon}`} />
        </svg>
    );
};

export default Icon;
export { IconType } from '../../../../lib/Icons';
