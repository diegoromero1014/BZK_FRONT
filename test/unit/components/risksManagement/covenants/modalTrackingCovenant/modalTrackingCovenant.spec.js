import { ModaltrackingCovenant } from "../../../../../../src/components/risksManagement/covenants/createTracking/modalTrackingCovenant";
import Immutable from 'immutable';


const clearCovenant = () => {};
const changeStatusCreate = () => {};
const changeStateSaveData = () => {};
const getInfoCovenant = () => {
    return new Promise((data) => {return true}, (err) => {return false});
};

let defaultProps = {
    clearCovenant,
    changeStatusCreate,
    changeStateSaveData,
    getInfoCovenant,
    covenantId: 123,
    covenant: Immutable.Map({
        covenantInfo: {
            idCovenant: 123,
            strCovenant: 'Algún tipo de covenant',       
            referenceValue: 312394,     
            productDetail: 'Este es el detalle del producto'            
        }        
    })
};

describe('Test Covenant/modalTrackingCovenant', () => {

    it('should render Col Covenant', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.covenant')).to.have.lengthOf(1);
    });

    it('should render Col Id Covenant', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.idCovenant')).to.have.lengthOf(1);
    });

    it('should render Col Valor de Referencia', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.referenceValue')).to.have.lengthOf(1);
    });

    it('should render Col Descripción covenant', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.description')).to.have.lengthOf(1);
    });

    it('should render Col Detalle del Producto', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.productDetail')).to.have.lengthOf(1);
    });

    it('should render Col Frecuencia de Revision', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.revisionFrequency')).to.have.lengthOf(1);
    });

    it('should render Col Linea de negocio', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.lineOfBusiness')).to.have.lengthOf(1);
    });

    it('should render Col Acta o contrato', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.agreement')).to.have.lengthOf(1);
    });

    it('should render Col Gerente responsable', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.manager')).to.have.lengthOf(1);
    });

    it('should render Col Fecha de creación', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.creationDate')).to.have.lengthOf(1);
    });

    it('should render Col Fecha de expiración', () => {
        const wrapper = shallow(<ModaltrackingCovenant {...defaultProps}></ModaltrackingCovenant>);
        expect(wrapper.find('Col.expirationDate')).to.have.lengthOf(1);
    });
})