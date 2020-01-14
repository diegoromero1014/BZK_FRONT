import React from 'react';

import Objectives, { renderElements } from '../../../../../src/components/fieldList/Objetives/Objetives';

describe("Test Objectives", () => {

    let elements = [];

    beforeEach(() => {
        elements = [
            {
                value: 'Objetivo 1',
                strategies: [
                    {
                        value: 'Estrategia 1'
                    },
                    {
                        value: 'Estrategia 2'
                    }
                ]
            },
            {
                value: 'Objetivo 2',
                strategies: [
                    {
                        value: 'Estrategia 1'
                    },
                    {
                        value: 'Estrategia 2'
                    }
                ]
            }
        ];
    });

    it("should render components", () => {
        itRenders(<Objectives />);
    });

    it('renderElements should show two row-element', () => {
        const removeElement = sinon.fake();
        const editElement = sinon.fake();        
        const response = renderElements(elements, removeElement, editElement);                  
        itRendersChildComponent(response, '.row-element', 2);
    });
})