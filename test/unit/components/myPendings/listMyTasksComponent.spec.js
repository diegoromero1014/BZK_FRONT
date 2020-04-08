import GridComponent from "../../../../src/components/grid/component";
import ListMyTasksComponent from "../../../../src/components/myTasks/listMyTasksComponent";

let defaultProps = {};


describe('Test ListMyTasksComponent' ,()=>{

    beforeEach(() => {
        defaultProps = {
            handleTaskByClientsFind: sinon.fake(),
            orderColumn: sinon.fake(),
            localStorage: sinon.fake()
        };
    });



    it('should render component', () => {
        itRenders(<ListMyTasksComponent {...defaultProps}/>);
        expect(defaultProps.handleTaskByClientsFind.called).to.equal(true);
        expect(GridComponent).to.have.lengthOf(1);
    });

    it('_renderHeaders should return the tasks list headers object', () => {
        const wrapper = itRenders(<ListMyTasksComponent {...defaultProps}/>);
        const headers = wrapper.instance()._renderHeaders();
        expect(headers).not.to.equal(null);
        expect(headers.find(header => header.key === 'responsable')).not.to.equal(null);
    });

    it('_renderHeaders should call _orderColumn when Fecha de Cierre is clicked', () => {
        const wrapper = itRenders(<ListMyTasksComponent {...defaultProps}/>);
        const headers = wrapper.instance()._renderHeaders();
        const dateTaskHeader = headers.find(header => header.key === 'dateTaskFormat');
        const dateTaskHeaderComponent = shallow(dateTaskHeader.orderColumn);
        dateTaskHeaderComponent.find('i').at(0).simulate('click');
        expect(headers).not.to.equal(null);
        expect(defaultProps.orderColumn.called).to.equal(true);
        expect(wrapper.state().orderA).to.equal('inline-block');
    });

    it('_renderHeaders should call _orderColumn when Fecha de Cierre is clicked', () => {
        const wrapper = itRenders(<ListMyTasksComponent {...defaultProps}/>);
        const headers = wrapper.instance()._renderHeaders();
        const dateTaskHeader = headers.find(header => header.key === 'dateTaskFormat');
        const dateTaskHeaderComponent = shallow(dateTaskHeader.orderColumn);
        dateTaskHeaderComponent.find('i').at(1).simulate('click');
        expect(headers).not.to.equal(null);
        expect(defaultProps.orderColumn.called).to.equal(true);
        expect(wrapper.state().orderA).to.equal('none');
    });


});