import ModalClientName from "../../../../../src/components/globalComponents/modalClientName/component";

describe('Test ModalClientName', () => {
    const defaultProps = {
        clientName: 'Algun cliente',
        typeDocument: 'CC',
        clientDocument: 3123213
    };

    it('should render component', () => {
        itRenders(<ModalClientName {...defaultProps}></ModalClientName>);
    });

    it('should render client information', () => {
        const {clientName, typeDocument, clientDocument} = defaultProps;
        const wrapper = shallow(<ModalClientName {...defaultProps}></ModalClientName>);
        expect(wrapper.find('span').find({name: 'clientDocument'}).text()).to.equal(`${typeDocument}:  ${clientDocument}`);
        expect(wrapper.find('span').find({name: 'clientName'}).text()).to.equal(`Cliente: ${clientName}`);
    });
});