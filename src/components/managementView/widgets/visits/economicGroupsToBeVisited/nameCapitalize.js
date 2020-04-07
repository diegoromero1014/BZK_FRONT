import React from 'react';

const NameCapitalize = ({ data }) => (
    <p style={{ textTransform: 'capitalize'}}>{data ? data : ''}</p>
);


export default NameCapitalize;