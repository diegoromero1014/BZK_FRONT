import React from 'react';

import CommercialReportButtonsComponent from '../../../../src/components/globalComponents/commercialReportButtonsComponent';         

const defaultProps = { onClickSave: () => {}, onClickDownloadPDF: () => {}, cancel: () => {} }

describe('Test globalComponents/commercialReportButtonsComponent', () => {

    it('It should render CommercialReportButtonsComponent.', () => {
        itRenders(<CommercialReportButtonsComponent {...defaultProps} />)
    });

    it('It should render once the main container commercialReportButtons.', () => {
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('div[name="commercialReportButtons"]')).to.have.length(1);
    });

    it('It should render once the button to pre-save.', () => {
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('button[name="btnPreSave"]')).to.have.length(1);
    });

    it('It should render once the button to save.', () => {
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('button[name="btnSave"]')).to.have.length(1);
    });

    it('It should render once the button to download PDF, if the OnClickDownloadPDF property exists.', () => {
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('button[name="btnSave"]')).to.have.length(1);
    });

    it('It shouldn´t render the button to download PDF, if the OnClickDownloadPDF property doesn´t exists.', () => {
        defaultProps.onClickDownloadPDF = null
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('button[name="btnDownloadPDF"]')).to.have.length(0);
    });

    it('It should render the button to Cancel.', () => {
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('button[name="btnCancel"]')).to.have.length(1);
    });
});