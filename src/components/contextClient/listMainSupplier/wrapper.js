import React from 'react';

import {ComponentListMainSupplier} from "./component";

export default class wrapper extends React.Component {
    render() {
        return (
            <ComponentListMainSupplier {...this.props} {...this.props.fields} />
        );
    }
}