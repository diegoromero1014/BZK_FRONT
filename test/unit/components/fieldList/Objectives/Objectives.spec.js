import React from 'react';

import Objectives, { renderElements } from '../../../../../src/components/fieldList/Objetives/Objetives';
import TemplateObjectiveAndStrategies from '../../../../../src/components/fieldList/Objetives/templateObjectiveAndStrategies';
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
})