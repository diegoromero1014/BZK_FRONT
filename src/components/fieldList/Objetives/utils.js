import React from 'react';

import makeFieldList from '../makeFieldList';
import Title from '../../clientEdit/sections/title';

export const listName = "objectives";

export const ListaObjetivos = makeFieldList(listName, [{ name: "strategies", alias: "strategies", initialValues: { value: "" } }]);
export const ListaEstrategias = makeFieldList("strategies");
export const helpText = "¿A dónde quiere llegar el cliente? ¿Cómo se visualiza en algunos años?";

export const objectivesInitialValues = {
    value: ""
}

export const strategiesInitialValues = {
    value: ""
}

export const ObjectiveSectionTitle =
    <Title
        text="Objetivos del cliente"
        icon={<i className="users icon" style={{ fontSize: "25px" }} />}
        helpText={helpText}
    />

export const StrategieSectionTitle = <Title
    text="Estrategias"
    icon={<i className="users icon" style={{ fontSize: "25px" }} />}
    isSection={false}
/>;

export const styles = {
    main: {
        padding: "0px 10px 10px 20px",
        marginTop: "15px"
    },
    buttonsDiv: {
        margin: "20px 0 20px 0"
    }
}