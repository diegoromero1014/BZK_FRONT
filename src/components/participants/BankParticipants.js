import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';
import $ from 'jquery';

import ComboBoxFilter from "../../ui/comboBoxFilter/comboBoxFilter";
import { renderLabel } from '../../functions';
import ListParticipants from './ListParticipants';

import { addParticipant } from './actions';
import { filterUsersBanco } from '../participantsVisitPre/actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';

import { KEY_PARTICIPANT_BANCO } from './constants';

export class BankParticipants extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedRecord: ''
        }
    }

    addBankParticipant = ({ name, idUsuario, cargo, empresa }) => {
        const { participants, dispatchAddParticipant, dispatchSwtShowMessage } = this.props;

        if (idUsuario) {
            let participant = participants.find(element => element.tipoParticipante === KEY_PARTICIPANT_BANCO && element.idParticipante === idUsuario);

            if (!participant) {
                let bankParticipant = {
                    tipoParticipante: KEY_PARTICIPANT_BANCO,
                    idParticipante: idUsuario,
                    nombreParticipante: name,
                    cargo,
                    empresa,
                    estiloSocial: '',
                    actitudBanco: '',
                    fecha: Date.now(),
                    uuid: _.uniqueId('participanBanco_'),
                }

                dispatchAddParticipant(bankParticipant);
            } else {
                dispatchSwtShowMessage('error', "Participante existente", "Señor usuario, el participante que desea agregar ya se encuentra en la lista");
            }
        } else {
            dispatchSwtShowMessage('error', "Error participante", "Señor usuario, para agregar un participante debe seleccionar un usuario del banco");
        }
    }

    updateKeyValue = event => {
        const { dispatchFilterUsersBanco, dispatchSwtShowMessage, limit } = this.props;
        const { selectedRecord } = this.state;

        if (event.keyCode === 13 || event.which === 13) {
            !event.consultclick && event.preventDefault();

            if (selectedRecord && selectedRecord.length >= 3) {
                $('.ui.search.participantBanc').toggleClass('loading');
                dispatchFilterUsersBanco(selectedRecord).then((data) => {
                    let participant = _.get(data, 'payload.data.data');
                    participant = participant.map(item =>
                        Object.assign(
                            item,
                            {
                                title: item.title + (item.cargo ? ` - ${item.cargo} ` : '') + (item.empresa ? ` - ${item.empresa} ` : ''), name: item.title
                            }
                        )
                    );

                    $('.ui.search.participantBanc')
                        .search({
                            cache: false,
                            source: participant,
                            maxResults: 1500,
                            searchFields: [
                                'title',
                                'description',
                                'idUsuario',
                                'cargo'
                            ],
                            onSelect: async e => {
                                if (limit && this.length() >= limit) {
                                    dispatchSwtShowMessage('error', "Límite de participantes", "Señor usuario, sólo se pueden agregar máximo 10 participantes por parte del banco");
                                    return;
                                } else {
                                    await this.setState({ selectedRecord: '' });
                                    this.addBankParticipant(e);
                                    return 'default';
                                }
                            }
                        });
                    $('.ui.search.participantBanc').toggleClass('loading');
                    setTimeout(() => $('#inputParticipantBanc').focus(), 150);
                });
            } else {
                dispatchSwtShowMessage('error', 'Error', 'Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
            }
        }
    }

    length = () => {
        const { participants } = this.props;
        return participants.toArray().filter(participant => participant.tipoParticipante === KEY_PARTICIPANT_BANCO).length;
    }

    render() {
        const { participants, disabled } = this.props;

        let data = _.chain(participants.toArray()).map(participant => participant).filter(participant => _.isEqual(participant.tipoParticipante, KEY_PARTICIPANT_BANCO)).value();

        return (
            <div className='bank-participants'>
                <Row style={{ marginTop: 20, marginLeft: 7 }}>
                    <Col xs={12} md={12} lg={12} >
                        {renderLabel({ name: 'Buscar participante', message: null, nullable: true })}

                        <div className="ui dropdown search participantBanc fluid" style={{ border: "0px", zIndex: "1", padding: "0px" }}>
                            <ComboBoxFilter
                                name="inputParticipantBanc"
                                placeholder="Ingrese un criterio de búsqueda..."
                                parentId="dashboardComponentScroll"
                                value={this.state.selectedRecord}
                                onChange={({ target: { value } }) => this.setState({ selectedRecord: value })}
                                onKeyPress={this.updateKeyValue}
                                max="255"
                                disabled={disabled ? 'disabled' : ''}
                            />
                        </div>
                    </Col>
                </Row>

                <div className='participants-client-list'>
                    <Row>
                        {data.length > 0 ?
                            <Col xs={12} md={12} lg={12}>
                                <ListParticipants data={data} disabled={disabled} type={KEY_PARTICIPANT_BANCO} />
                            </Col>
                            :
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                    <span className="form-item">Aún no se han adicionado participantes</span>
                                </div>
                            </Col>
                        }
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ participants }) => ({ participants });

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchFilterUsersBanco: filterUsersBanco,
        dispatchSwtShowMessage: swtShowMessage,
        dispatchAddParticipant: addParticipant
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BankParticipants);