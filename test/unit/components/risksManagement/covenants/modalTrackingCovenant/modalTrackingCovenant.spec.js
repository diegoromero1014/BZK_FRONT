import { ModaltrackingCovenant } from "../../../../../../src/components/risksManagement/covenants/createTracking/modalTrackingCovenant";
import Immutable from 'immutable';
import * as globalActions from "../../../../../../src/components/globalComponents/actions";

describe('Test Covenant/modalTrackingCovenant', () => {

    let clearCovenant;
    let changeStatusCreate;
    let changeStateSaveData;
    let getInfoCovenant;
    let defaultProps;
    let stubRedirectUrl;

    afterEach(() => {
        stubRedirectUrl.restore();
    });

    beforeEach(() => {    

        stubRedirectUrl = sinon.stub(globalActions, "redirectUrl");
        clearCovenant = sinon.fake();
        changeStatusCreate = sinon.fake();
        changeStateSaveData = sinon.fake();
        getInfoCovenant = sinon.stub();
        getInfoCovenant.resolves(true);

        defaultProps = {
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
    });

    it('should render component', () => {
        itRenders(<ModaltrackingCovenant {...defaultProps}/>);
    });

    it('should render Col Covenant', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.covenant');
    });

    it('should render Col Id Covenant', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.idCovenant');
    });

    it('should render Col Valor de Referencia', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.referenceValue');
    });

    it('should render Col Descripción covenant', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.description');
    });

    it('should render Col Detalle del Producto', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.productDetail');
    });

    it('should render Col Frecuencia de Revision', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.revisionFrequency');
    });

    it('should render Col Linea de negocio', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.lineOfBusiness');
    });

    it('should render Col Acta o contrato', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.agreement');
    });

    it('should render Col Gerente responsable', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.manager');
    });

    it('should render Col Fecha de creación', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.creationDate');
    });

    it('should render Col Fecha de expiración', () => {        
        itRendersChildComponent(<ModaltrackingCovenant {...defaultProps}/>, 'Col.expirationDate');
    });
})