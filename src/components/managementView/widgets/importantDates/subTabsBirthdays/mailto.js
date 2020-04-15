import React from 'react';
import { capitalize } from 'lodash';
import { NAME } from './constants';

const MailTo = ({ data, type }) => (
    <a href={`mailto:${data.email}?Subject=¡Feliz cumpleaños ${capitalize(data.contactName)}!`}>
        {type === NAME ? data.contactName : data.contactLastName}
    </a>
);

export default MailTo;