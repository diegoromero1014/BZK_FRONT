import React from 'react';
import { Icon } from "semantic-ui-react";
import ReportsCardsComponent from '../../../../src/components/transactional/ReportsCardsComponent';
import CategoryComponent from '../../../../src/components/transactional/CategoryComponent';

const defaultProps = {
    title: 'title test',
    iconName: 'chart bar',
    content: [
        {
            title: "Matriz de rentabilidad",
            description: "Visualice, para un rubro y centro seleccionados, su información de PRODUCTOS y SEGMENTOS",
            type: "frame",
            url: "https://panoramicadelcliente.bancolombia.corp/ReportS/report/Panoramica%20del%20Cliente/Reportes/MatrizRentabilidad"
        }
    ]
};

describe('Test CategoryComponent ', () => {
    it('Shoukd render CategoryComponent', () => {
        const wrapper = shallow(<CategoryComponent {...defaultProps} />);
        expect(wrapper).to.have.length(1);
    });

    it('Shoukd render ReportsCardsComponent', () => {
        const wrapper = shallow(<CategoryComponent {...defaultProps} />);
        wrapper.instance().handleRenderContent(wrapper.instance().props.content);
        expect(wrapper.find(ReportsCardsComponent)).to.have.length(1);
    });

    it('Shoukd render Icon angle down', () => {
        const wrapper = shallow(<CategoryComponent {...defaultProps} />);
        expect(wrapper.find(Icon).find({name: 'angle down'})).to.have.length(1);
    });

    it('Shoukd render Icon chart bar', () => {
        const wrapper = shallow(<CategoryComponent {...defaultProps} />);
        expect(wrapper.find(Icon).find({name: wrapper.instance().props.iconName ? wrapper.instance().props.iconName : 'angle down'})).to.have.length(1);
    });
})