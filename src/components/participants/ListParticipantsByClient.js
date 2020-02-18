import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CardComponent from '../cards';
import { Card, Image, Icon } from 'semantic-ui-react';
import user from '../../../img/icon/user.png';
import { deleteParticipant } from './actions';
import { KEY_PARTICIPANT_CLIENT } from './constants';
import Tooltip from "../toolTip/toolTipComponent";
import { swtShowMessage } from '../sweetAlertMessages/actions';


class ListParticipantsByClient extends Component {
    handleRenderParticipants = (disabled, data) => {
        const { handleOpenModal } = this.props;

        return data.map((participant, index) => (
            <CardComponent
                key={index}
                header={
                    <Image src={user} wrapped ui={false} className='img-header-participants-list' />
                }
                content={
                    <div>
                        <Card.Header className='title-content-participants-list'>{participant.nombreParticipante}</Card.Header>
                        <Card.Description>
                            <span>{participant.cargo}</span><br />
                            <span>{participant.estiloSocial}</span><br />
                            <span>{participant.actitudBanco}</span><br /> <br />
                            {!disabled ?
                                <Tooltip text={'Click para ver más'}>
                                    <span>
                                        <a>- Objetivos del interlocutor</a>
                                    </span>
                                </Tooltip>

                                :

                                <span>
                                    <a>- Objetivos del interlocutor</a>
                                </span>
                            }
                        </Card.Description>
                    </div>
                }
                footer={
                    !disabled &&
                    <a className={'delete-card'} onClick={event => {
                        event.preventDefault();
                        this.handleOnClickDelete(participant.idParticipante);
                    }}>
                        <Icon name='delete' />
                        Eliminar
                        </a>
                }
                handleOnClick={() => !disabled && handleOpenModal(participant)}
                style={{ width: 230, color: 'black' }}
                className={disabled ? 'disabled' : ''}
            />
        ))
    }

    handleOnClickDelete = id => {
        const { dispatchSwtShowMessage } = this.props;

        dispatchSwtShowMessage(
            'warning',
            "Eliminación participante",
            "¿Señor usuario, está seguro que desea eliminar el participante?",
            {
                onConfirmCallback: () => this.handleDelete(id),
                onCancelCallback: () => { }
            },
            {
                "confirmButtonColor": '#DD6B55',
                "confirmButtonText": 'Sí, estoy seguro!',
                "cancelButtonText": "Cancelar",
                "showCancelButton": true,
            }
        );
    };

    handleDelete = selectedRecord => {
        const { participants, dispatchDeleteParticipant } = this.props;

        dispatchDeleteParticipant(participants.findIndex(item => item.idParticipante === selectedRecord), KEY_PARTICIPANT_CLIENT);

        this.setState({ selectedRecord: null });
    }


    render() {
        const { disabled, data } = this.props;

        return (
            <div className='list-participants-container'>
                {this.handleRenderParticipants(disabled, data)}
            </div>
        );
    }
}

const mapStateToProps = ({ participants }) => ({
    participants
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchDeleteParticipant: deleteParticipant,
        dispatchSwtShowMessage: swtShowMessage
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ListParticipantsByClient)