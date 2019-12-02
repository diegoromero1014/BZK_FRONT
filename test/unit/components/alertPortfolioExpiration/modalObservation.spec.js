import React from 'react'
import Immutable from 'immutable';
import { ModalObservation } from '../../../../src/components/alertPortfolioExpirtation/modalObservation';
import Textarea from '../../../../src/ui/textarea/textareaComponent';
import ComboBox from '../../../../src/ui/comboBox/comboBoxComponent';
import { createFieldsFromArray } from '../../../helpers/ReduxFormField';
import * as swtActions from '../../../../src/components/sweetAlertMessages/actions';

const selectsReducer = Immutable.Map({});

describe('Test ModalObservation', () => {

    let fields = createFieldsFromArray(["observations", "expectations"]);
    let swtShowMessage;
    let defaultProps;
    let saveObservationPortfolioExp

    beforeEach(() => {
        
        swtShowMessage = sinon.fake();
        saveObservationPortfolioExp = sinon.stub();
        saveObservationPortfolioExp.resolves("")

        defaultProps = {
            fields: fields,
            handleSubmit: () => {},
            showLoading: () => {},
            swtShowMessage,
            selectsReducer,
            client: {
                clientName: 'Algun cliente',
                typeDocument: 'CC',
                document: 12323123         
            },
            saveObservationPortfolioExp       
        };

    });



    it('should render component', () => {
        itRenders(<ModalObservation {...defaultProps} />);
    });

    it('should render observations field', () => {
        const wrapper = shallow(            
            <ModalObservation {...defaultProps} />            
        );        
        expect(wrapper.find(Textarea).hasClass('observationsField')).to.equal(true);
        
    });

    it('should render expectations field', () => {
        const wrapper = shallow(            
            <ModalObservation {...defaultProps} />            
        );        
        expect(wrapper.find(ComboBox).hasClass('expectationsField')).to.equal(true);
        
    });

    it('should return error when observation is empty call handleSaveObservation', () => {
        const wrapper = shallow(
            <ModalObservation {...defaultProps} />
        );

        wrapper.instance()._handleSaveObservation();

        expect(swtShowMessage.callCount).to.equal(1);
        expect(saveObservationPortfolioExp.callCount).to.equal(0);
    })

    it('should save when observation is not empty call handleSaveObservation', () => {
        let newFields = createFieldsFromArray(["observations", "expectations"]);
        newFields["observations"].onChange("observacion");
        newFields["expectations"].onChange("expectations");

        const wrapper = shallow(
            <ModalObservation {...defaultProps} fields={newFields} />
        );

        wrapper.instance()._handleSaveObservation();
        expect(saveObservationPortfolioExp.called).to.equal(true);
    })
})
