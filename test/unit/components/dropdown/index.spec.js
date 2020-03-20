import React from 'react';
import DropdownComponent from '../../../../src/components/dropdown/index';
import { noop } from 'lodash';

let defaultProps ; 
let buildOptions ;

describe('Test DropdownComponent', () => {

    beforeEach(() => {
        buildOptions = sinon.fake();

        defaultProps = {
            data : {},
            icon : 'ellipsis vertical',
            options : [
                {
                    icon: 'icon',
                    text: "Test unit",
                    onclick: noop
                },
                {
                    icon: 'icon',
                    text: "Test unit",
                    onclick: noop
                }
            ],

            buildOptions
        }
    })

    describe('Test rendering', () => {
        
        it('Rendering DropdownComponent', () => {
            itRenders(<DropdownComponent {...defaultProps}/>)
        })        
    })
})