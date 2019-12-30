import React, { Component } from 'react';
import Tooltip from "../toolTip/toolTipComponent";
import { TITLE_BANC_PARTICIPANTS, TITLE_CLIENT_PARTICIPANTS, TITLE_OTHERS_PARTICIPANTS } from "../../constantsGlobal";
import ParticipantesBancolombia from "../participantsVisitPre/participantesBancolombia";
import ParticipantesOtros from "../participantsVisitPre/participantesOtros";
import ParticipantsByClient from '../participants/ParticipantsByClient';

class Participants extends Component {

    handleToggleClass = index => {
        let elements = Array.from(document.getElementsByClassName("item-tab"));
        let segments = Array.from(document.getElementsByClassName("segment-item"));
    
        elements.forEach(element => {
            element.classList.remove("active");
        });
    
        segments.forEach(segment => {
            segment.classList.remove("active");
        });
    
        elements[index].classList.add("active");
        segments[index].classList.add("active");
    }

    render() {
        const {disabled, limitParticipantsByClient} = this.props;        
        return (
            <div>
                <div className="ui top attached tabular menu" style={{ width: "100%" }}>
                    <a
                        className={`active item item-tab`}
                        style={{ width: "33%" }}
                        data-tab="first"
                        onClick={() => this.handleToggleClass(0)}
                    >
                        Participantes en la reunión por parte del cliente
                        <Tooltip text={TITLE_CLIENT_PARTICIPANTS}>
                            <i className="help circle icon blue" style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                        </Tooltip>
                    </a>
                    <a
                        className={`item item-tab`}
                        style={{ width: "40%" }}
                        data-tab="second"
                        onClick={() => this.handleToggleClass(1)}
                    >
                        Participantes en la reunión por parte del Grupo Bancolombia
                        <Tooltip text={TITLE_BANC_PARTICIPANTS}>
                            <i className="help circle icon blue" style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                        </Tooltip>
                    </a>
                    <a
                        className={`item item-tab`}
                        style={{ width: "26%" }}
                        data-tab="third"
                        onClick={() => this.handleToggleClass(2)}
                    >
                        Otros participantes en la reunión
                        <Tooltip text={TITLE_OTHERS_PARTICIPANTS}>
                            <i className="help circle icon blue" style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                        </Tooltip>
                    </a>
                </div>


                <div className={`ui bottom attached active tab segment segment-item`} data-tab="first">
                    <ParticipantsByClient disabled={disabled} limitParticipantsByClient={limitParticipantsByClient} />
                </div>

                <div className={`ui bottom attached tab segment segment-item`} data-tab="second">
                    <ParticipantesBancolombia />
                </div>

                <div className={`ui bottom attached tab segment segment-item`} data-tab="third">
                    <ParticipantesOtros />
                </div>
            </div>
        )
    }
}

export default Participants;
