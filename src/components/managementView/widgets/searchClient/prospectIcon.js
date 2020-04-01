import React from 'react';
import { STYLE_ICON_PROSPECT } from './constants';

const ProspectIcon = ({ data }) => (
    <div
        className="prospect"
        style={Object.assign({}, STYLE_ICON_PROSPECT, !data && { display: 'none' })}
    >
        P
    </div>
);


export default ProspectIcon;