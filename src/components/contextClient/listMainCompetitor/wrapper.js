import React from 'react';

import {ComponentListMainCompetitor} from "./component";

export default class wrapper extends React.Component {
    render() {
        return (
            <ComponentListMainCompetitor {...this.props} {...this.props.fields} />
        );
    }
}