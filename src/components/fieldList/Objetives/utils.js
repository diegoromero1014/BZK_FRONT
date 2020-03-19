import React from 'react';
import { mapKeys } from 'lodash';

import makeFieldList from '../makeFieldList';
import Title from '../../clientEdit/sections/title';

import { processRules } from '../../../validationsFields/rulesField';

export const listName = "objectives";

export const objectiveChildrenList = [{ name: "strategies", alias: "strategies", initialValues: { value: "" } }];

export const ListaObjetivos = makeFieldList(listName, objectiveChildrenList);

export const ListaEstrategias = makeFieldList("strategies");
export const helpText = "¿A dónde quiere llegar el cliente? ¿Cómo se visualiza en algunos años?";

export const elementsKey = "elements";
export const draftElementsKey = "draftElements";

export const objectivesInitialValues = {
    value: ""
}

export const strategiesInitialValues = {
    value: ""
}

export const makeObjectiveSectionTitle = (isObligatory) => (<Title
    text="Objetivos del cliente"
    icon={<i className="users icon" style={{ fontSize: "25px" }} />}
    helpText={helpText}
    isObligatory={isObligatory}
/>);


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

export const validateSchema = (fields, schema) => {
    const fieldErrors = processRules(fields, schema);
    let errors = []
    mapKeys(fieldErrors, (value, _) => {
        if (value) {
            errors.push(value);
        }
    })
    return [errors, fieldErrors];
}