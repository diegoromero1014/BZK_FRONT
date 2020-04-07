import AssignedTasks from "../../../../../../src/components/managementView/widgets/tasks/AssignedTasks";

let defaultProps = {
    tasks: [1, 2],
    handleRedirect: sinon.stub()
};

describe('AssignedTasks test', () => {
    it('Should render component', () => {
        itRenders(<AssignedTasks {...defaultProps} />);
    });

    describe('Test Button', () => {
        it('onClick', () => {
            const wrapper = itRenders(<AssignedTasks {...defaultProps} />);
            const button = wrapper.find('Button');

            button.at(0).simulate('click');
        });
    });
});