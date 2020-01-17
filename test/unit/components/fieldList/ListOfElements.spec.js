import React from 'react';

import ListOfElements from '../../../../src/components/fieldList/ListOfElements';

describe("Test ListOfElements", () => {

    let defaultProps;
    let renderElement;
    let renderAddSection;

    beforeEach(() => {
        renderElement = sinon.fake();
        renderAddSection = sinon.fake();
        defaultProps = {
            renderElement,
            renderAddSection,
            elements: [{value: "asd"}]
        }
    });

    it("should render not found class when elements is empty", () => {
        const wrapper = shallow(<ListOfElements />);
        expect(wrapper.find('.elements-not-found').length).to.equal(1);
        expect(wrapper.find(".section-btn-save").length).to.equal(0);
        expect(wrapper.find(".section-btn-cancel").length).to.equal(0);
        expect(wrapper.find(".add-section").length).to.equal(1);
    });

    it("should call renderElement when elements aren't empty", () => {
        shallow(<ListOfElements {...defaultProps} />);
        expect(renderElement.callCount).to.equal(1);
    });

    it("should call renderAddSection when showAddSection is true", () => {
        const wrapper = shallow(<ListOfElements {...defaultProps} showAddSection={true} />);
        expect(wrapper.find(".add-section").length).to.equal(0);
        expect(renderAddSection.callCount).to.equal(1);
    });

    it("should render add cancel button when shouldRenderAddCancelButton is true", () => {
        const wrapper = shallow(<ListOfElements {...defaultProps} shouldRenderAddCancelButton={true} showAddSection={true} />);
        expect(wrapper.find(".section-btn-save").length).to.equal(1);
        expect(wrapper.find(".section-btn-cancel").length).to.equal(1);
    })
});