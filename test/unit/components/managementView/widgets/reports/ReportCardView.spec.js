import ReportCardView from "../../../../../../src/components/managementView/widgets/reports/ReportCardView";

const defaultProps = {}

describe('Test ReportCardView', () => {

    beforeEach(() => {
        defaultProps.title = 'Title';
        defaultProps.editable = true;
        defaultProps.background = null;
        defaultProps.renderModal = <div /> 
    });

    describe('Redering unit test', () => {
        it('should render when editable is true', () => {
            const wrapper = shallow(<ReportCardView {...defaultProps} />);
            const card = wrapper.find('div', { className: 'report-card-view' });

            card.at(0).simulate('click');

            expect(wrapper.state().open).to.equal(true);
        });

        it('should render when editable is false', () => {
            defaultProps.editable = false;

            const wrapper = shallow(<ReportCardView {...defaultProps} />);
            const card = wrapper.find('div', { className: 'report-card-view' });

            card.at(0).simulate('click');

            expect(wrapper.state().open).to.equal(false);
        });
    });

    describe('Execute functions', () => {
        it('execute function handleCloseModal', () => {
            const wrapper = shallow(<ReportCardView {...defaultProps} />);

            wrapper.state().open = true;

            wrapper.instance().handleCloseModal();

            expect(wrapper.state().open).to.equal(false);
        });
    });
});