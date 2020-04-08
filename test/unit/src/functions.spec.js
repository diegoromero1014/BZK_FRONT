import {getUsernameInitials, renderLabel, renderMessageError} from "../../../src/functions";
import {MESSAGE_WARNING_FORBIDDEN_CHARACTER} from "../../../src/validationsFields/validationsMessages";
import React from 'react';

describe('Test src/functions', () => {

    it('renderMessageError test', () => {
        const response = renderMessageError(MESSAGE_WARNING_FORBIDDEN_CHARACTER);
        const wrapper = shallow(response);
        expect(wrapper.text()).to.equal(` ${MESSAGE_WARNING_FORBIDDEN_CHARACTER} `);
    });

    it('getUsernameInitials test', () => {
        const response = getUsernameInitials('Daniel Gallego');
        expect(response).to.equal('DG');
    });

    it('getUsernameInitials test when username has a length lower than 2', () => {
        const response = getUsernameInitials('Daniel');
        expect(response).to.equal('DA');
    });

    it('renderLabel test', () => {
       const response = renderLabel({
           name: 'field',
           message: null,
           nullable: true
       });
       const wrapper = shallow(response);
       expect(wrapper.find('span').text()).to.equal('field ');
    });

    it('renderLabel test when nullable is false', () => {
        const response = renderLabel({
            name: 'field',
            message: null,
            nullable: false
        });
        const wrapper = shallow(response);
        expect(wrapper.find('span').at(1).text()).to.equal('*');
    });

    it('renderLabel test when message contains a value', () => {
        const response = renderLabel({
            name: 'field',
            message: 'Mensaje de ayuda para field',
            nullable: false
        });
        const wrapper = shallow(response);
        expect(wrapper.find('i.help')).to.have.lengthOf(1);
    });
});