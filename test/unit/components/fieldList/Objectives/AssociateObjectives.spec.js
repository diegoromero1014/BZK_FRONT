import AssociateObjectives from '../../../../../src/components/fieldList/Objetives/AssociateObjectives';
import BiztrackModal from '../../../../../src/components/fieldList/Objetives/BiztrackModal'

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
            isEditable={true}
        />);
        const addButton = wrapper.find(".icon-message-elements");
        
        addButton.simulate("click");

        expect(changeListState.callCount).to.equals(1);
        expect(changeListState.firstCall.lastArg.draftElements).to.have.length(elements.length)
        expect(changeListState.firstCall.lastArg.showAssociateSection).to.equals(true)
    })

    it("should show BiztrackModal when showAssociateSection is true", () => {
        const wrapper = shallow(<AssociateObjectives 
            {...defaultProps}
            showAssociateSection={true}
        />);

        expect(wrapper.find(BiztrackModal)).to.have.length(1);
        
    });

    it("should changeAssociationOfElements", () => {

        const elements = [
            {
                id: 1,
                associated: false,
                strategies: [{
                    id: 2,
                    associated: false
                }]
            }
        ]

        const changedElement = {
            id: 1
        }

        const wrapper = shallow(<AssociateObjectives {...defaultProps} />)
        const result = wrapper.instance().changeAssociationOfElements(elements, changedElement);

        expect(result).to.have.length(1);
        expect(result[0].associated).to.equal(true);
        expect(result[0].strategies[0].associated).to.equal(true)

    })

    it("should show error message when there is not checked element", () => {
        const swtShowMessage = sinon.fake();
        const draftElements = [
            {
                id: 5,
                associated: false
            }
        ]
        const wrapper = shallow(<AssociateObjectives
            {...defaultProps}
            swtShowMessage={swtShowMessage}
            draftElements={draftElements}
        />)
        wrapper.instance().associateElements();
        expect(swtShowMessage.callCount).to.equal(1);
    })

    it("should changeListState when there is checked element", () => {
        const swtShowMessage = sinon.fake();
        const changeListState = sinon.fake();
        const draftElements = [
            {
                id: 5,
                associated: true
            }
        ]
        const wrapper = shallow(<AssociateObjectives
            {...defaultProps}
            swtShowMessage={swtShowMessage}
            draftElements={draftElements}
            changeListState={changeListState}
        />)
        wrapper.instance().associateElements();
        expect(swtShowMessage.callCount).to.equal(0);
        expect(changeListState.callCount).to.equal(1)
    })

    it('should checkDraftElement', () => {
        const changeListState = sinon.fake();
        const wrapper = shallow(<AssociateObjectives 
            {...defaultProps}
            changeListState={changeListState}
        />)

        wrapper.instance().checkDraftElement([])

        expect(changeListState.callCount).to.equal(1)
    })

    it('should checkElement', () => {
        const swtShowMessage = sinon.fake();
        const wrapper = shallow(<AssociateObjectives 
            {...defaultProps}
            swtShowMessage={swtShowMessage}
        />)
        wrapper.instance().checkElement([]);

        expect(swtShowMessage.callCount).to.equal(1)
    })

    it('shoukd hideAssociateSection', () => {
        const changeListState = sinon.fake();
        const wrapper = shallow(<AssociateObjectives 
            {...defaultProps}
            changeListState={changeListState}
        />)

        wrapper.instance().hideAssociateSection();

        expect(changeListState.callCount).to.equal(1);
        expect(changeListState.firstCall.lastArg.showAssociateSection).to.equal(false)
    })
})