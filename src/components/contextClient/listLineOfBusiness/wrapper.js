import React from 'react';

import {ComponentListLineBusiness} from './componentListLineBusiness';

export default class wrapper extends React.Component {
    render() {
        return (
            <ComponentListLineBusiness {...this.props} {...this.props.fields} />
        );
    }
}
