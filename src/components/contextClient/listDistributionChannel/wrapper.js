import React from 'react';

import {ComponentListDistributionChannel} from "./component";

export default class wrapper extends React.Component {
    render() {
        return (
            <ComponentListDistributionChannel {...this.props} {...this.props.fields} />
        );
    }
}