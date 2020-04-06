import SearchEmployeeInputRedux, {SearchEmployeeInput} from "../../../../../src/components/globalComponents/searchEmployeeInput/component";
import ComboBoxFilter from "../../../../../src/ui/comboBoxFilter/comboBoxFilter";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import React from 'react';

let defaultProps;
let store;
let dispatchFilterUserBanco;
let dispatchSwtShowMessage;
let dispatchAddEmployeeValue;
let validateOnChange;
let onSelect;
let preventDefault;
let consultclick;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test globalComponents/searchEmployeeInput', () => {

    beforeEach(() => {
        dispatchFilterUserBanco = sinon.stub();
        dispatchFilterUserBanco.resolves({
            payload: {
                data: {
                    data: [
                        {
                            id: 1,
                            title: 'Daniel Gallego'
                        },
                        {
                            id: 2,
                            title: 'Daniel Rodriguez'
                        }]
                }
            }
        });
        preventDefault = sinon.fake();
        consultclick = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();
        dispatchAddEmployeeValue = sinon.fake();
        validateOnChange = sinon.fake();
        onSelect = sinon.fake();
        defaultProps = {
            searchEmployeeInputReducer: {
                employeeValue: ''
            },
            dispatchFilterUserBanco,
            dispatchSwtShowMessage,
            dispatchAddEmployeeValue,
            validateOnChange,
            onSelect,
            isEditable: false
        };
        store = mockStore({
            defaultProps
        });
    });

    describe('Test redux component', () => {
        it('should render component', () => {
            itRenders(<SearchEmployeeInputRedux store={store}/>)
        });
    });

    describe('Test only class component', () => {

        it('should render component', () => {
           itRenders(<SearchEmployeeInput {...defaultProps}/>);
        });

        it('should render employee ComboBoxFilter', () => {
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            expect(wrapper.find(ComboBoxFilter).find({name: 'employee'})).to.have.lengthOf(1);
        });

        it('should render employee ComboBoxFilter as disabled', () => {
            defaultProps.isEditable = true;
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            expect(wrapper.find(ComboBoxFilter).find({name: 'employee'})).to.have.lengthOf(1);
            expect(wrapper.find(ComboBoxFilter).find({name: 'employee'}).prop('disabled')).to.equals('disabled');
        });

        it('should simulate employee ComboBoxFilter onChange', () => {
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            const employeeComboBoxFilter = wrapper.find(ComboBoxFilter).find({name: 'employee'});
            employeeComboBoxFilter.simulate('change', { target: { value: 'Daniel Gallego' } });
            expect(validateOnChange.called).to.equals(true);
        });

        it('should simulate employee ComboBoxFilter onSelect', () => {
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            const employeeComboBoxFilter = wrapper.find(ComboBoxFilter).find({name: 'employee'});
            employeeComboBoxFilter.simulate('select', { target: { value: 'Daniel Gallego' } });
            expect(onSelect.called).to.equals(true);
        });

        it('should simulate employee ComboBoxFilter onKeyPress', () => {
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            const employeeComboBoxFilter = wrapper.find(ComboBoxFilter).find({name: 'employee'});
            employeeComboBoxFilter.simulate('keyPress', { target: { value: 'Daniel Gallego' } });
        });

        it('updateKeyValueUserBanco should call dispatchSwtShowMessage when employeeValue length is less than 3', () => {
            defaultProps.searchEmployeeInputReducer.employeeValue = 'Da';
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            wrapper.instance().updateKeyValueUsersBanco({ keyCode: 13, which: 13, preventDefault});
            expect(dispatchSwtShowMessage.called).to.equals(true);
        });

        it('updateKeyValueUserBanco should not call preventDefault', () => {
            defaultProps.searchEmployeeInputReducer.employeeValue = 'Da';
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            wrapper.instance().updateKeyValueUsersBanco({ keyCode: 13, which: 13, consultclick});
            expect(preventDefault.called).to.equals(false);
        });

        it('updateKeyValueUserBanco should call dispatchFilterUserBanco when employeeValue length is greater than 3', () => {
            defaultProps.searchEmployeeInputReducer.employeeValue = 'Dani';
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            wrapper.instance().updateKeyValueUsersBanco({ keyCode: 13, which: 13, preventDefault});
            expect(dispatchSwtShowMessage.called).to.equals(false);
            expect(dispatchFilterUserBanco.called).to.equals(true);
        });

        it('updateKeyValueUserBanco should do nothing when employeeValue is null', () => {
            defaultProps.searchEmployeeInputReducer.employeeValue = null;
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            expect(dispatchSwtShowMessage.called).to.equals(false);
            expect(dispatchFilterUserBanco.called).to.equals(false);
        });

        it('updateKeyValueUserBanco should do nothing when employeeValue is empty', () => {
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            expect(dispatchSwtShowMessage.called).to.equals(false);
            expect(dispatchFilterUserBanco.called).to.equals(false);
        });

        it('updateKeyValueUserBanco should do nothing when employeeValue is undefined', () => {
            defaultProps.searchEmployeeInputReducer.employeeValue = undefined;
            const wrapper = shallow(<SearchEmployeeInput {...defaultProps}/>);
            expect(dispatchSwtShowMessage.called).to.equals(false);
            expect(dispatchFilterUserBanco.called).to.equals(false);
        });
    });
});