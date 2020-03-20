import React from "react";
import { DownloadPipeline } from "../../../../../src/components/pipeline/downloadReportPipeline/component";
import { shallow } from "enzyme";

let defaultProps;
let dispatchSwtShowMessage;

describe("DownloadPipeline Test", () => {

    beforeEach(() => {
        dispatchSwtShowMessage = sinon.fake();
        defaultProps = {
            fields: {
                initialValidityDate: {
                    value: null
                },
                finalValidityDate: {
                    value: null,
                    onChange: sinon.fake()
                }
            },
            dispatchSwtShowMessage,
            itemSelectedModal: 3,
            dispatchGetPipelineXls: sinon.fake(),
        }
    });

    it('should render component', () => {
        itRenders(<DownloadPipeline {...defaultProps}/>);
    });

    it('When instance downloadPipeline and initialValidityDate.value is null', () => {
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null})
        wrapper.instance().downloadPipeline();
        expect(wrapper.state().initialDateError).to.equal('Debe seleccionar una fecha');
    });

    it('When instance downloadPipeline and initialValidityDate.value is empty', () => {
        defaultProps.fields.initialValidityDate.value = '';
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null})
        wrapper.instance().downloadPipeline();
        expect(wrapper.state().initialDateError).to.equal('Debe seleccionar una fecha');
    });

    it('When instance downloadPipeline and initialValidityDate.value is not empty but invalid', () => {
        defaultProps.fields.initialValidityDate.value = 'a';
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null})
        wrapper.instance().downloadPipeline();
        expect(wrapper.state().initialDateError).to.equal('Debe seleccionar una fecha');
    });

    it('When instance downloadPipeline and initialValidityDate.value is not empty and valid, and finalValidityDate.value is null', () => {
        defaultProps.fields.initialValidityDate.value = '10/10/2020';
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null})
        wrapper.instance().downloadPipeline();
        expect(wrapper.state().initialDateError).to.equal(null);
        expect(wrapper.state().finalDateError).to.equal('Debe seleccionar una fecha');
    });

    it('When instance downloadPipeline and initialValidityDate.value is not empty and valid, and finalValidityDate.value is empty', () => {
        defaultProps.fields.initialValidityDate.value = '10/10/2020';
        defaultProps.fields.finalValidityDate.value = '';
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null})
        wrapper.instance().downloadPipeline();
        expect(wrapper.state().initialDateError).to.equal(null);
        expect(wrapper.state().finalDateError).to.equal('Debe seleccionar una fecha');
    });

    it('When instance downloadPipeline and initialValidityDate.value is not empty and valid, and finalValidityDate.value is not empty but invalid', () => {
        defaultProps.fields.initialValidityDate.value = '10/10/2020';
        defaultProps.fields.finalValidityDate.value = 'a';
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null})
        wrapper.instance().downloadPipeline();
        expect(wrapper.state().initialDateError).to.equal(null);
        expect(wrapper.state().finalDateError).to.equal('Debe seleccionar una fecha');
    });

    it('When instance downloadPipeline and initialValidityDate.value is not empty and valid, and finalValidityDate.value is not empty and valid', () => {
        defaultProps.fields.initialValidityDate.value = '10/10/2020';
        defaultProps.fields.finalValidityDate.value = '10/10/2020';
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null})
        wrapper.instance().downloadPipeline();
        expect(wrapper.state().initialDateError).to.equal(null);
        expect(wrapper.state().finalDateError).to.equal(null);
    });

    it('When instance downloadPipeline and are valids, and itemSelectedModal, is not equal to TAB_PIPELINE', () => {
        defaultProps.fields.initialValidityDate.value = '10/10/2020';
        defaultProps.fields.finalValidityDate.value = '10/10/2020';
        defaultProps.itemSelectedModal = 0;
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null})
        wrapper.instance().downloadPipeline();
        expect(wrapper.state().initialDateError).to.equal(null);
        expect(wrapper.state().finalDateError).to.equal(null);
    });
    
    it('When onSelectFieldDate is instanced', () => {
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null });
        wrapper.instance().onSelectFieldDate();
        expect(wrapper.state().initialDateError).to.equal(null);
        expect(wrapper.state().finalDateError).to.equal(false);
    });

    it('When onSelectFieldDate is instanced and first paramenter is not null', () => {
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null });
        wrapper.instance().onSelectFieldDate('10/10/2020');
        expect(wrapper.state().initialDateError).to.equal(false);
        expect(wrapper.state().finalDateError).to.equal(null);
    });

    it('When onSelectFieldDate is instanced and the values are emptys', () => {
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null });
        wrapper.instance().onSelectFieldDate('', '');
        expect(wrapper.state().initialDateError).to.equal(null);
        expect(wrapper.state().finalDateError).to.equal(false);
    });

    it('When onSelectFieldDate is instanced and the values are not emptys', () => {
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null });
        wrapper.instance().onSelectFieldDate('11/10/2020', '10/10/2020');
        expect(wrapper.state().initialDateError).to.equal(false);
        expect(wrapper.state().finalDateError).to.equal(false);
        sinon.assert.calledOnce(dispatchSwtShowMessage);
    });

    it('When onSelectFieldDate is instanced and the values are not emptys', () => {
        const wrapper = shallow(<DownloadPipeline {...defaultProps} />);
        wrapper.setState({ initialDateError: null, finalDateError: null });
        wrapper.instance().onSelectFieldDate('10/10/2020', '10/10/2020');
        expect(wrapper.state().initialDateError).to.equal(false);
        expect(wrapper.state().finalDateError).to.equal(false);
        sinon.assert.notCalled(dispatchSwtShowMessage);
    });
});