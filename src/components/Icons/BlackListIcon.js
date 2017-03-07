/**
 * Created by Andres Hurtado on 01/03/2017.
 */
import { Icon } from 'semantic-ui-react'
import React from 'react';

let BlackListIcon = (props) => (
    <Icon.Group style={{marginTop: '33px', marginLeft: "18px"}}>
        <Icon style={{fontSize: "50px"}} name='users' />
        <Icon style={{fontSize: "20px", right: '-20px', textShadow:'inherit'}} corner name='dont' />
    </Icon.Group>
);

export default BlackListIcon;