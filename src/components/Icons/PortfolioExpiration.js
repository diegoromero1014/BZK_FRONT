/**
 * Created by ahurtado on 12/9/2016.
 */
import { Icon } from 'semantic-ui-react'
import React from 'react';

let PortfolioExpirationIcon = (props) => (
    <Icon.Group style={{marginTop: '33px', marginLeft: "18px"}}>
        <Icon style={{fontSize: "50px"}} name='usd' />
        <Icon style={{fontSize: "20px", right: '-20px', textShadow:'inherit', top:'auto', left:'auto'}} corner name='calendar times' />
    </Icon.Group>
);

export default PortfolioExpirationIcon;