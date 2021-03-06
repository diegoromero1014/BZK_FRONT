import { Icon } from 'semantic-ui-react'
import React from 'react';

let PortfolioExpirationIcon = (props) => (
    <Icon.Group style={{marginTop: '33px', marginLeft: "18px"}}>
        <Icon style={{fontSize: "50px"}} name='usd' />
        <Icon style={{fontSize: "20px", right: '-20px', textShadow:'inherit'}} corner name='delete calendar' />
    </Icon.Group>
);

export default PortfolioExpirationIcon;