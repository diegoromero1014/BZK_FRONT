import React from 'react';
import SectionImportantDates from '../../../../../../src/components/managementView/widgets/importantDates';

let defaultProps = {} ;

describe('Unit test SectionImportantDates component', () => {

    it('Rendering test', () => {
        itRenders(<SectionImportantDates {...defaultProps} />)
    })
})