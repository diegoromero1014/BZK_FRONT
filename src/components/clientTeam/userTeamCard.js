import React, {Component} from "react";
import {shorterStringValue} from '../../actionsGlobal';
import Tooltip from '../toolTip/toolTipComponent';

class UserTeamCard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {name, position, email, company, assistant} = this.props;
        return (
            <div>
                <div className="client-card" style={{width: "260px", float: "left", cursor: 'default'}}>
                    <div className="celula-card-top">
                        <div className="celula-card-top-left">
                            <div className="celula-title">{shorterStringValue(name)}</div>
                            <div className="celula-name">{shorterStringValue(position)}</div>
                            <div className="celula-title">{shorterStringValue(company, 25)}</div>
                            <div className="celula-name" style={{
                                marginTop: "5px",
                                fontStyle: "italic"
                            }}>{shorterStringValue(assistant, 30)}</div>
                        </div>
                    </div>
                    <div className="celula-card-bottom" style={{backgroundColor: "#B0E0E6"}}>
                        <Tooltip text={email}>
                            <i className="mail right icon blue" style={{marginTop: "-15px"}}></i>
                        </Tooltip>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserTeamCard;
