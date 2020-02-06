import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CardComponent from '../cards';
import { Card, Image, Icon } from 'semantic-ui-react';
import user from '../../../img/icon/user.png';
import SweetAlert from '../sweetalertFocus';
import { deleteParticipant } from './actions';
import { KEY_PARTICIPANT_BANCO, KEY_PARTICIPANT_OTHER } from './constants';

class ListParticipants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
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

    handleOnClick = selectedRecord => this.setState({ open: true, selectedRecord });

    handleDelete = () => {
        const { data, dispatchDeleteParticipant, type } = this.props;
        const { selectedRecord } = this.state;

        if (type === KEY_PARTICIPANT_BANCO) {
            dispatchDeleteParticipant(data.findIndex(item => item.idParticipante === selectedRecord.idParticipante), KEY_PARTICIPANT_BANCO);
        } else if (type === KEY_PARTICIPANT_OTHER) {
            dispatchDeleteParticipant(data.findIndex(item => item === selectedRecord), KEY_PARTICIPANT_OTHER);
        }

        this.setState({ open: false, selectedRecord: null });
    }


    render() {
        const { disabled, key } = this.props;
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
                    onConfirm={this.handleDelete}
                />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchDeleteParticipant: deleteParticipant
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(ListParticipants)