import React from 'react';

import {ComponentListIntOperations} from "./component";

export default class wrapper extends React.Component {
    render() {
        return (
            <ComponentListIntOperations {...this.props} {...this.props.fields} />
        );
    }
}