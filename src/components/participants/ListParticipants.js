import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Image, Icon } from 'semantic-ui-react';

import CardComponent from '../cards';
import SweetAlert from '../sweetalertFocus';

import { deleteParticipant } from './actions';

import { KEY_PARTICIPANT_BANCO, KEY_PARTICIPANT_OTHER } from './constants';

import user from '../../../img/icon/user.png';

export class ListParticipants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            record: null
        }
    }

    handleRenderParticipants = disabled => {
        const { data } = this.props;

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
                            <span>{participant.empresa}</span><br />
                        </Card.Description>
                    </div>
                }
                footer={
                    !disabled &&
                    <a className={'delete-card'} onClick={() => this.handleOnClick(participant)}>
                        <Icon name='delete' />
                        Eliminar
                        </a>
                }
                style={{ width: 230, color: 'black' }}
                className={disabled ? 'disabled' : ''}
            />
        ))
    }

    handleOnClick = record => this.setState({ open: true, record });

    handleDelete = () => {
        const { participants, dispatchDeleteParticipant, type } = this.props;
        const { record } = this.state;

        if (type === KEY_PARTICIPANT_BANCO) {
            dispatchDeleteParticipant(participants.findIndex(item => item.idParticipante === record.idParticipante), KEY_PARTICIPANT_BANCO);
        } else if (type === KEY_PARTICIPANT_OTHER) {
            dispatchDeleteParticipant(participants.findIndex(item => item === record), KEY_PARTICIPANT_OTHER);
        }
        this.setState({ record: null });
    }


    render() {
        const { disabled } = this.props;
        const { open } = this.state;

        return (
            <div className='list-participants-container'>
                {this.handleRenderParticipants(disabled)}

                <SweetAlert
                    type="warning"
                    show={open}
                    title="Eliminación participante"
                    text="¿Señor usuario, está seguro que desea eliminar el participante?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ open: false })}
                    onConfirm={() => {
                        this.setState({ open: false });
                        this.handleDelete();
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ participants }) => ({
    participants
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchDeleteParticipant: deleteParticipant
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ListParticipants)