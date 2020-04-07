import React from 'react';
import { PENDING } from '../../../../src/components/pendingTask/constants';
import { shallow } from 'enzyme';
import PaginationPendingTaskComponent from '../../../../src/components/pendingTask/paginationPendingTaskComponent';

const clearUserTask = spy(sinon.stub());
const tab = {
    rowCount: 0
}
const defaultProps = {
  clearUserTask,
  mode: PENDING,
  tab
};

describe("Test PaginationPendingTaskComponent", () => {
    it("should render PaginationPendingTaskComponent", () => {
        let wrapper = shallow(<PaginationPendingTaskComponent {...defaultProps}/>);
        expect(wrapper).to.have.length(1);
        expect(clearUserTask).to.have.been.called.exactly(1);
    });
    it("test _handlePaginar", () => {
        let handlePaginar = spy(sinon.stub());
        let wrapper = shallow(<PaginationPendingTaskComponent {...defaultProps} handlePaginar={handlePaginar}/>);
        wrapper.instance()._handlePaginar(0);
        expect(handlePaginar).to.have.been.called.exactly(1);
    });
});