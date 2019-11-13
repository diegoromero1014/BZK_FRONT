import React from 'react';

import PageNotFound from '../../../../src/components/notFoundPage/PageNotFound';

describe('Test page not found component', () => {

    it('sould render div whit class pageNotFound', () => {
       const wrapper = shallow(<PageNotFound />);
       expect(wrapper.find(".page-not-found")).to.have.length(1);
    });

    it('sould render tag p', () => {
        const wrapper = shallow(<PageNotFound />);
        expect(wrapper.find("p")).to.have.length(1);
    });

    it('sould render tag div whit class brand', () => {
        const wrapper = shallow(<PageNotFound />);
        expect(wrapper.find("div")).to.have.length(2);
    });

    it('sould render tag img', () => {
        const wrapper = shallow(<PageNotFound />);
        expect(wrapper.find("img")).to.have.length(2);
    });
});