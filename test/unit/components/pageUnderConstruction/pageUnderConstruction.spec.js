import React from './node_modules/react'
import pageUnderConstruction from '../../../../src/components/pageUnderConstruction/pageUnderConstruction';

describe('Test PageUnderConstruction', () => {
  it('should render PageUnderConstruction', () => {
      const wrapper = shallow(<pageUnderConstruction />);
      expect(wrapper).to.have.length(1);
  });
});
