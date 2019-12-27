import React, { Component } from 'react';
import CardComponent from '../cards';
import { Card, Image } from 'semantic-ui-react';
import user from '../../../img/icon/user.png';

class ListParticipantsByClient extends Component {

    handleRenderParticipants = () => {
        const { data } = this.props;

        return data.map(({nombreParticipante, cargo, estiloSocial, actitudBanco}) => (
            <CardComponent 
                header={
                    <Image src={user} wrapped ui={false} className='img-header-participants-list' />
                }
                content= {
                    <div>
                        <Card.Header className='title-content-participants-list'>{ nombreParticipante }</Card.Header>

                        <Card.Meta>
                            <span className='date'>Joined in 2015</span>
                        </Card.Meta>

                        <Card.Description>
                            Matthew is a musician living in Nashville.
                        </Card.Description>
                    </div>
                }
            />
        ))
    }

    render() {
        return (
            <div className='list-participants-container'>
                {this.handleRenderParticipants()}
            </div>                
        );
    }
}


export default ListParticipantsByClient;