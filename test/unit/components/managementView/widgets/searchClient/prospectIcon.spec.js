import React from 'react';
import ProspectIcon from '../../../../../../src/components/managementView/widgets/searchClient/prospectIcon';

let defaultProps ;

describe('Unit test ProspectIcon component', () => {

    beforeEach(()=> {
        defaultProps = {
            data : true 
        }
    })

    it('Test rendering ProspectIcon component', () => {
        itRenders(<ProspectIcon {...defaultProps}/>)
    })
    
})