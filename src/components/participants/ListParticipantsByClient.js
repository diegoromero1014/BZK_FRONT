import React, { Component } from 'react';
import CardComponent from '../cards';
import { Card, Image, Icon } from 'semantic-ui-react';
import user from '../../../img/icon/user.png';

class ListParticipantsByClient extends Component {

    handleRenderParticipants = disabled => {
        const { data } = this.props;

        return data.map(({nombreParticipante, cargo, estiloSocial, actitudBanco}) => (
            <CardComponent 
                header={
                    <Image src={user} wrapped ui={false} className='img-header-participants-list' />
                }
                content= {
                    <div>
                        <Card.Header className='title-content-participants-list'>{ nombreParticipante }</Card.Header>
                        <Card.Description>
                            <span>{cargo}</span><br />
                            <span>{estiloSocial}</span> <br />
                            <span>{actitudBanco}</span>
                        </Card.Description>
                    </div>
                }
                footer={
                    !disabled &&
                        <a>
                            <Icon name='delete' />
                            Eliminar
                        </a>
                }
            />
        ))
    }

    render() {
        const { disabled: { disabled }} = this.props;
        return (
            <div className='list-participants-container'>
                {this.handleRenderParticipants(disabled)}
            </div>                
        );
    }
}


export default ListParticipantsByClient;