import { renderFields, renderElements } from "../../../../../src/components/fieldList/Strategies/Strategies";
import TextArea from '../../../../../src/ui/textarea/textareaComponent';

describe('Test Strategies component', () => {

    let renderFieldsProps = {};
    let renderElementsProps = {};

    beforeEach(() => {
        renderFieldsProps = {
            fields: {
                value: 'Algun valor'
            },
            onChange: sinon.fake(),
            onAddElement: sinon.fake(),
            onCancel: sinon.fake(),
            isEditing: true,
            errors: {
                value: 'Algun error'
            }
        };

        renderElementsProps = {
            elements: [],
            removeElement: sinon.fake(),
            editElement: sinon.fake()
        };
    });

    it('should render renderFields and should contains text Modificar Estrategia', () => {
        const response = renderFields(renderFieldsProps);
        const wrapper = shallow(response);
        expect(wrapper.find(TextArea)).to.have.length(1);
        expect(wrapper.find('.btn-secondary')).to.have.length(1);
        expect(wrapper.find('.cancel-btn')).to.have.length(1);
        expect(wrapper.find('.btn-secondary').text()).to.equal("Modificar Estrategia");
    });

    it('should render renderFields and should contains text Agregar Estrategia', () => {
        renderFieldsProps.isEditing = false;
        renderFieldsProps.fields.value = null;
        const response = renderFields(renderFieldsProps);
        const wrapper = shallow(response);
        expect(wrapper.find(TextArea)).to.have.length(1);
        expect(wrapper.find('.btn-secondary')).to.have.length(1);
        expect(wrapper.find('.cancel-btn')).to.have.length(1);
        expect(wrapper.find('.btn-secondary').text()).to.equal("Agregar Estrategia");
    });

    it('renderElements should render Sin estrategias when elements is empty', () => {        
        const response = renderElements(renderElementsProps.elements, renderElementsProps.removeElement, renderElementsProps.editElement);
        const wrapper = shallow(response);
        expect(wrapper.find('div').text()).to.equal('Sin estrategias');
    });

    it('renderElements should render every element in elements array', () => {
        renderElementsProps.elements = [
            {
                value: 'Objetivo 1'
            },
            {
                value: 'Objetivo 2'
            }
        ];
        const response = renderElements(renderElementsProps.elements, renderElementsProps.removeElement, renderElementsProps.editElement);
        const wrapper = shallow(response);   
        expect(wrapper.find('.section-list-divider')).to.have.length(2);
    });

    it('renderElements simulate onClick on edit icon', () => {
        renderElementsProps.elements = [
            {
                value: 'Objetivo 1'
            },
            {
                value: 'Objetivo 2'
            }
        ];
        const response = renderElements(renderElementsProps.elements, renderElementsProps.removeElement, renderElementsProps.editElement);
        const wrapper = shallow(response);   
        wrapper.find('.edit').at(0).simulate('click');
        expect(wrapper.find('.section-list-divider')).to.have.length(2);
        expect(renderElementsProps.editElement.calledOnce).to.equal(true);
    });

    it('renderElements simulate onClick on trash icon', () => {
        renderElementsProps.elements = [
            {
                value: 'Objetivo 1'
            },
            {
                value: 'Objetivo 2'
            }
        ];
        const response = renderElements(renderElementsProps.elements, renderElementsProps.removeElement, renderElementsProps.editElement);
        const wrapper = shallow(response);   
        wrapper.find('.trash').at(0).simulate('click');
        expect(wrapper.find('.section-list-divider')).to.have.length(2);
        expect(renderElementsProps.removeElement.calledOnce).to.equal(true);
    });
});