import React from 'react';
import { comboBoxFilter } from '../../../../src/ui/comboBoxFilter/comboBoxFilter';

const sendValue = 'heurrea';

describe('Test ui/ComboBoxFilter', () => {
    it('send value', () => {
        const wrapper = shallow(<comboBoxFilter  />);
        expect(wrapper.find('input')).to.have.length(0);
    });
});