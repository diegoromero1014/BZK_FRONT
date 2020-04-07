import MyTask from "../../../../../../src/components/managementView/widgets/tasks/MyTask";

let defaultProps = {
    tasks: [1, 2],
    handleRedirect: sinon.stub()
};

describe('MyTask test', () => {
    it('Should render component', () => {
        itRenders(<MyTask {...defaultProps} />);
    });

    describe('Test Button', () => {
        it('onClick', () => {
            const wrapper = itRenders(<MyTask {...defaultProps} />);
            const button = wrapper.find('Button');

            button.at(0).simulate('click');
        });
    });

});