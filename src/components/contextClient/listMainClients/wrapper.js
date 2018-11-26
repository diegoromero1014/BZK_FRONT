import React from 'react';

import {ComponentListMainClients} from "./component";

export default class wrapper extends React.Component {
    render() {
        return (
            <ComponentListMainClients {...this.props} {...this.props.fields} />
        );
    }
}