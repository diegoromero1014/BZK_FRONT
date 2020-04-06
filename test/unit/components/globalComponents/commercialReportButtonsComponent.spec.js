import React from 'react';

import CommercialReportButtonsComponent from '../../../../src/components/globalComponents/commercialReportButtonsComponent';         

const defaultProps = {
    onClickSave: sinon.fake(),
    onClickDownloadPDF: () => {},
    cancel: () => {},
    fromModal: true,
    creatingReport: true,
    isEditable: false,
    documentDraft: false
};

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

    it('It should call onClickSave when simulate click on btnPreSave', () => {
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        const preSaveButton = wrapper.find('button').find({name: 'btnPreSave'});
        preSaveButton.simulate('click');
        expect(defaultProps.onClickSave.called).to.equals(true);
    });

    it('It should render once the pre-save and save button when creatingReport is true', () => {
        defaultProps.isEditable = true;
        defaultProps.documentDraft = true;
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('button').find({name: 'btnPreSave'})).to.have.lengthOf(1);
        expect(wrapper.find('button').find({name: 'btnSave'})).to.have.lengthOf(1);
    });

    it('It should render once the button to save.', () => {
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('button[name="btnSave"]')).to.have.length(1);
    });

    it('It should call onClickSave when simulate click on btnSave', () => {
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        const saveButton = wrapper.find('button').find({name: 'btnSave'});
        saveButton.simulate('click');
        expect(defaultProps.onClickSave.called).to.equals(true);
    });

    it('It should render once the button to download PDF, if the OnClickDownloadPDF property exists.', () => {
        defaultProps.creatingReport = false;
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('button').find({name: 'btnDownloadPDF'})).to.have.lengthOf(1);
    });

    it('It shouldn´t render the button to download PDF, if the OnClickDownloadPDF property doesn´t exists.', () => {
        defaultProps.onClickDownloadPDF = null
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('button[name="btnDownloadPDF"]')).to.have.length(0);
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

    it('It should render a div commercialReportButtons with position fixed and width calc', () => {
        defaultProps.fromModal = false;
        const wrapper = shallow(<CommercialReportButtonsComponent {...defaultProps} />);
        expect(wrapper.find('div').find({ name: 'commercialReportButtons' })).to.have.lengthOf(1);
        expect(wrapper.find('div').find({ name: 'commercialReportButtons' }).props().style.position).to.equals('fixed');
        expect(wrapper.find('div').find({ name: 'commercialReportButtons' }).props().style.width).to.equals('calc(100% - 190px)');
    });

});