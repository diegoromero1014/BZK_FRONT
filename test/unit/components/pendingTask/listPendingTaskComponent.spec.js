import ListPendingTaskComponent from "../../../../src/components/pendingTask/listPendingTaskComponent";
import GridComponent from "../../../../src/components/grid/component";

let defaultProps = {};

describe('Test listPendingTaskComponent', () => {

    beforeEach(() => {
        defaultProps = {
            handleTaskByClientsFind: sinon.fake(),
            orderColumn: sinon.fake()
        };
    });

    describe('Rendering test', () => {

        it('should render component', () => {
           itRenders(<ListPendingTaskComponent {...defaultProps}/>);
           expect(defaultProps.handleTaskByClientsFind.called).to.equal(true);
           expect(GridComponent).to.have.lengthOf(1);
        });
    });

    describe('Actions test', () => {

        it('_renderHeaders should return the tasks list headers object', () => {
            const wrapper = itRenders(<ListPendingTaskComponent {...defaultProps}/>);
            const headers = wrapper.instance()._renderHeaders();
            expect(headers).not.to.equal(null);
            expect(headers.find(header => header.key === 'responsable')).not.to.equal(null);
        });

        it('_renderHeaders should call _orderColumn when Fecha de Cierre is clicked', () => {
            const wrapper = itRenders(<ListPendingTaskComponent {...defaultProps}/>);
            const headers = wrapper.instance()._renderHeaders();
            const dateTaskHeader = headers.find(header => header.key === 'dateTaskFormat');
            const dateTaskHeaderComponent = shallow(dateTaskHeader.orderColumn);
            dateTaskHeaderComponent.find('i').at(0).simulate('click');
            expect(headers).not.to.equal(null);
            expect(defaultProps.orderColumn.called).to.equal(true);
            expect(wrapper.state().orderA).to.equal('inline-block');
        });

        it('_renderHeaders should call _orderColumn when Fecha de Cierre is clicked', () => {
            const wrapper = itRenders(<ListPendingTaskComponent {...defaultProps}/>);
            const headers = wrapper.instance()._renderHeaders();
            const dateTaskHeader = headers.find(header => header.key === 'dateTaskFormat');
            const dateTaskHeaderComponent = shallow(dateTaskHeader.orderColumn);
            dateTaskHeaderComponent.find('i').at(1).simulate('click');
            expect(headers).not.to.equal(null);
            expect(defaultProps.orderColumn.called).to.equal(true);
            expect(wrapper.state().orderA).to.equal('none');
        });

        it('_orderColumn should set orderA none and orderD inline-block in state when orderTask is equal to 1', () => {
            const wrapper = itRenders(<ListPendingTaskComponent {...defaultProps}/>);
            wrapper.instance()._orderColumn(1);
            expect(wrapper.state().orderA).to.equal('none');
            expect(wrapper.state().orderD).to.equal('inline-block');
            expect(defaultProps.orderColumn.called).to.equal(true);
        });

        it('_orderColumn should set orderA inline-block and orderD none in state when orderTask is equal to 0', () => {
            const wrapper = itRenders(<ListPendingTaskComponent {...defaultProps}/>);
            wrapper.instance()._orderColumn(0);
            expect(wrapper.state().orderA).to.equal('inline-block');
            expect(wrapper.state().orderD).to.equal('none');
            expect(defaultProps.orderColumn.called).to.equal(true);
        });

        it('_renderCellView should return a formatted data', () => {
            const wrapper = itRenders(<ListPendingTaskComponent {...defaultProps}/>);
            const data = [
                {
                    responsible: 'Daniel Gallego',
                    assignedBy: 'Monica Castillo',
                    statusTask: 'Pendiente',
                    workDaysToClose: 3
                }
            ];
            const result = wrapper.instance()._renderCellView(data);
            expect(result).to.have.lengthOf(1);
            expect(result[0].trafficLightIndicator.isFinalized).to.equal(false);
        });

        it('_renderCellView should return a formatted data when statusTask is Cancelada', () => {
            const wrapper = itRenders(<ListPendingTaskComponent {...defaultProps}/>);
            const data = [
                {
                    responsible: 'Daniel Gallego',
                    assignedBy: 'Monica Castillo',
                    statusTask: 'Cancelada',
                    workDaysToClose: 3
                }
            ];
            const result = wrapper.instance()._renderCellView(data);
            expect(result).to.have.lengthOf(1);
            expect(result[0].trafficLightIndicator.isFinalized).to.equal(true);
        });

        it('_renderCellView should return a formatted data when statusTask is Cerrada', () => {
            const wrapper = itRenders(<ListPendingTaskComponent {...defaultProps}/>);
            const data = [
                {
                    responsible: 'Daniel Gallego',
                    assignedBy: 'Monica Castillo',
                    statusTask: 'Cerrada',
                    workDaysToClose: 3
                }
            ];
            const result = wrapper.instance()._renderCellView(data);
            expect(result).to.have.lengthOf(1);
            expect(result[0].trafficLightIndicator.isFinalized).to.equal(true);
        });
    });
});