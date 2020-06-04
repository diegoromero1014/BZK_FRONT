import React from 'react';
import { Button } from 'semantic-ui-react';
import Doughnut from '../../../chart/doughnut';
import { buildDataStructure } from './utilities';

const AssignedTasks = ({ tasks, handleRedirect }) => {
    const { elements, data } = buildDataStructure(['Finalizadas', 'Pendientes'], tasks);

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
                style={{ background: 'transparent', marginTop: 20, color: '#00448c', fontSize: '16px' }}
                onClick={() => handleRedirect()}
            >
                Ver detalle
                </Button>
        </div>
    );
};

export default AssignedTasks;