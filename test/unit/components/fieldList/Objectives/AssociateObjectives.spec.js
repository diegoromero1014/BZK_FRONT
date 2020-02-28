import AssociateObjectives from '../../../../../src/components/fieldList/Objetives/AssociateObjectives';

describe("Test AssociateObjectives", () => {

    let elements = []

    let defaultProps = {
        elements
    }

    it("should render AssociateObjectives", () => {
        itRenders(<AssociateObjectives {...defaultProps} />);
    })

    it("should contains elements-not-found when there are not checked elements", () => {
        const wrapper = shallow(<AssociateObjectives {...defaultProps} />);
        expect(wrapper.find('.elements-not-found')).to.have.length(1);
    })

    it("should set draftElements when user click add boton", () => {

        const changeListState = sinon.fake();

        elements = [
            {
                id: 1
            }, 
            {
                id: 2
            }
        ]

        const wrapper = shallow(<AssociateObjectives 
            {...defaultProps}
            changeListState={changeListState}
            elements={elements}
        />);
        const addButton = wrapper.find(".icon-message-elements");
        addButton.simulate("click");

        expect(changeListState.callCount).to.equals(1);
        expect(changeListState.firstCall.lastArg.draftElements).to.have.length(elements.length)
        expect(changeListState.firstCall.lastArg.showAssociateSection).to.equals(true)
    })
})