import React from 'react';
import { ListTasks } from "../../../../../src/components/visit/tasks/listTasks";
import Immutable from 'immutable';

let defaultProps = {};

describe('Test ListTasks Component', () => {

    beforeEach(() => {
        defaultProps = {
            tasks: Immutable.List([
                {
                    uuid: 'task0001',
                    responsable: 'Daniel Gallego',
                    fechaForm: new Date(),
                    fecha: new Date(),
                    tarea: 'Alguna tarea',
                    textTarea: 'Descripción tarea',
                    idResponsable: 1,
                    id: 123,
                    notes: []
                }
            ])
        };
    });

    describe('Rendering tests', () => {

        it('should render listTasks component', () => {
            itRenders(<ListTasks {...defaultProps}/>)
        });
    });
});