import React from 'react';
import Immutable from 'immutable';
import Textarea from '~/src/ui/textarea/textareaComponent';
import Modal from 'react-modal';
import LinkEntities from '~/src/components/clientDetailsInfo/linkingClient/LinkEntitiesComponent/linkEntities';

import { createFieldsFromArray } from "~/test/helpers/ReduxFormField.js";

import {ButtonLinkClientComponent} from '~/src/components/clientDetailsInfo/linkingClient/buttonLinkClientComponent';

const fields = createFieldsFromArray(["observationTrader"]);

const infoClient = Immutable.Map({ 'responseClientInfo': { linkingRequestId: null} });

const consultParameterServer = () => new Promise(() => {});

const handleSubmit = () => {};

const defaultProps = { fields: fields, handleSubmit, infoClient, getMasterDataFields:() => null, 
    clearEntities:() => null, setEntities:() => {}, consultParameterServer };

describe('Test ButtonLinkClientComponent', () => {

    it('should render Observación', () => {
        const wrapper = shallow(<ButtonLinkClientComponent {...defaultProps}/>);
        expect(wrapper.find(Textarea).find({ name: 'actionArea' })).to.have.length(1);
    });
    it('should not render Observación', () => {
        const infoClientObservation = Immutable.Map({});
        infoClientObservation.linkingRequestId = 1;
        const wrapper = shallow(<ButtonLinkClientComponent {...defaultProps} infoClient={infoClientObservation}/>);
        expect(wrapper.find(Textarea).find({ name: 'actionArea' })).to.have.length(0);
    });
    it('should render Modal', () => {
        const wrapper = shallow(<ButtonLinkClientComponent {...defaultProps}/>);
        expect(wrapper.find(Modal)).to.have.length(1);
    });
    it('should render LinkEntities', () => {
        const wrapper = shallow(<ButtonLinkClientComponent {...defaultProps}/>);
        expect(wrapper.find(LinkEntities)).to.have.length(1);
    });
});

