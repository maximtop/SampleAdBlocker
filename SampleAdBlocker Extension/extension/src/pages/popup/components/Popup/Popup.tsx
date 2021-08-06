import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';

import { Actions } from '../Actions';
import { popupStore } from '../../stores/PopupStore';

import './popup.pcss';

/**
 * TODO
 *  - add loader window
 */
export const Popup = observer(() => {
    const store = useContext(popupStore);

    useEffect(() => {
        store.getPopupData();
    });

    return (
        <div className="popup">
            <Actions />
        </div>
    );
});
