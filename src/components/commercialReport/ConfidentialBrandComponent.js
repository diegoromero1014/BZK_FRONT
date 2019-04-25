import React from 'react';
import { BRAND_CONFIDENTIAL } from './constants';
import '../../../styles/modules/UserPermissions/Confidential.scss';

const ConfidentialBrandComponent = (props) => {
    return (
        <span className="brand-confidential">{" " + BRAND_CONFIDENTIAL}</span>
    );
};

export default ConfidentialBrandComponent;