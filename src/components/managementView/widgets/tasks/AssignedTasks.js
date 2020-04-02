import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Doughnut from '../../../chart/doughnut';
import { buildDataStructure } from './utilities';

class AssignedTasks extends Component {

    render() {
        const { elements, data } = buildDataStructure(['Finalizadas', 'Pendientes'], [10, 40]);

        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Doughnut elements={elements} data={data} />
                <Button
                    fluid
                    style={{ background: 'transparent', marginTop: 20 }}
                    onClick={() => { }}
                >
                    Ver detalle
                </Button>
            </div>
        );
    }
}

export default AssignedTasks;