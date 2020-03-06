import React, { Component } from 'react';
import Reports from './widgets/reports';

class Board extends Component {

    render() {
        return (
            <div style={{ marginTop: 50 }}>
                <Reports />
            </div>
        );
    }
}

export default Board;