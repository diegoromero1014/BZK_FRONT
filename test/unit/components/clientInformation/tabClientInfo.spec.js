import React from 'react';
import {TabClientInfo} from '~/src/components/clientInformation/tabClientInfo';
import Immutable from "immutable";

const tabReducer = {
    get: () => {},
    _: () =>{}
};

const navBar = Immutable.Map({});

const defaultProps = {tabReducer, navBar};

describe('Test TabClientInfo', () => {
    it('Should render InfoTab', ()=> {
        const wrapper = shallow(<TabClientInfo {...defaultProps}/>);
        expect(wrapper.find('li').find({id: 'infoTab'})).to.have.length(1);
    });
});