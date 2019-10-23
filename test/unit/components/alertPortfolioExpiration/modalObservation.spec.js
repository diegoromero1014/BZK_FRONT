import React from 'react'
import Immutable from 'immutable';
import { ModalObservation } from '../../../../src/components/alertPortfolioExpirtation/modalObservation';
import Textarea from '../../../../src/ui/textarea/textareaComponent';
import ComboBox from '../../../../src/ui/comboBox/comboBoxComponent';

const selectsReducer = Immutable.Map({});

describe('Test ModalObservation', () => {

    const defaultProps = {
        fields: {
            observations: null,
            expectations: null
        },
        handleSubmit: () => {},
        selectsReducer,
        clientName: 'Algun cliente'        
    };
    

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
})
