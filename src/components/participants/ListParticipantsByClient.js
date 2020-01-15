import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CardComponent from '../cards';
import { Card, Image, Icon } from 'semantic-ui-react';
import user from '../../../img/icon/user.png';
import SweetAlert from '../sweetalertFocus';
import { deleteParticipant } from './actions';
import { KEY_PARTICIPANT_CLIENT } from './constants';
import Tooltip from "../toolTip/toolTipComponent";


class ListParticipantsByClient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }
    }

    handleRenderParticipants = disabled => {
        const { data, handleOpenModal } = this.props;

        return data.map((participant, index) => (
            <CardComponent 
                key={index}
                header={
                    <Image src={user} wrapped ui={false} className='img-header-participants-list' />
                }
                content= {
                    <div>
                        <Card.Header className='title-content-participants-list'>{ participant.nombreParticipante }</Card.Header>
                        <Card.Description>
                            <span>{participant.cargo}</span><br />
                            <span>{participant.estiloSocial}</span><br />
                            <span>{participant.actitudBanco}</span><br /> <br />
                            <Tooltip text={'Click para ver más'}>
                                <span>
                                    <a>- Objetivos del interlocutor</a>
                                </span>        
                            </Tooltip>
                        </Card.Description>
                    </div>
                }
                footer={
                    !disabled &&
                        <a onClick={() => this.handleOnClickDelete(participant.idParticipante)}>
                            <Icon name='delete' />
                            Eliminar
                        </a>
                }
                handleOnClick={() => handleOpenModal(participant)}
                style={{ width: 230, color: 'black' }}
            />
        ))
    }

    handleOnClickDelete = id => this.setState({ open: true, selectedRecord: id });

    handleDelete = () => {
        const { data, dispatchDeleteParticipant } = this.props;
        const { selectedRecord } = this.state;

        let participant = data.findIndex(item => item.idParticipante === selectedRecord);
        
        this.setState({ open: false, selectedRecord: null });

        dispatchDeleteParticipant(participant, KEY_PARTICIPANT_CLIENT);
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
 
export default connect(null, mapDispatchToProps)(ListParticipantsByClient)