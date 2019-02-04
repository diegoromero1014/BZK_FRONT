import React from 'react';
import Immutable from 'immutable';
import ReduxFormField, { createFieldsFromArray } from "~/test/helpers/ReduxFormField.js";

import Textarea from "../../../../../src/ui/textarea/textareaComponent";
import { ModalObservationRiskGroup } from '~/src/components/clientRiskGroup/observationsRiskGoup/modalObservationRiskGroup';

const fields = createFieldsFromArray(["observation"]);

const changeStateSaveData = () => { };
const getListObservationsRiskGroupById = () => new Promise((resolve, reject) => { });
const riskGroupReducer = Immutable.Map({});
const infoRiskGroup = Immutable.Map({});
const listObservations = Immutable.Map([]);
const defaultProps = { fields: fields, changeStateSaveData, getListObservationsRiskGroupById, riskGroupReducer, listObservations }

describe('Test ClientRiskGroup/modalObservationRiskGroup', () => {
    it('should render observation', () => {
        const wrapper = shallow(<ModalObservationRiskGroup infoRiskGroup {...defaultProps} />);
        expect(wrapper.find(Textarea).find({ name: 'observation' })).to.have.length(1);
    });
});