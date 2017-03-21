/**
 * Created by Andres Hurtado on 15/03/2017.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import LinkEntities from './LinkEntitiesComponent/linkEntities';
import Modal from 'react-modal';
import {isEmpty,isEqual} from 'lodash';

class ButtonLinkClientComponent extends Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.state = {
            modalIsOpen: false
        };
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render() {
        const {infoClient} = this.props;
        console.log("infoClient >>>", infoClient);
        const paddingButtons = {paddingRight: '7px', paddingLeft: '7px'};
        return (
            <Col style={paddingButtons}>
                <button className="btn" onClick={this.openModal}>
                    <span >Vincular</span></button>

                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog modalBt4-lg">
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}}
                                    id="myModalLabel">Vincular cliente</h4>
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal"
                                        role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i
                                        className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <div style={{padding: '20px 20px 20px 20px'}}>
                                <table style={{width: "100%"}}>
                                    <thead>
                                    <tr>
                                        <th><span
                                            style={{fontWeight: "bold", color: "#4C5360"}}>Tipo de documento</span></th>
                                        <th><span
                                            style={{fontWeight: "bold", color: "#4C5360"}}>Número de documento</span>
                                        </th>
                                        <th><span
                                            style={{fontWeight: "bold", color: "#4C5360"}}>Nombre/Razón social</span>
                                        </th>
                                        <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Célula</span></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td style={{width: "25%", verticalAlign: "initial"}}>
                                            <span style={{marginLeft: "0px"}}>{infoClient.clientNameType}</span>
                                        </td>
                                        <td style={{width: "25%", verticalAlign: "initial"}}>
                                            <span style={{marginLeft: "0px"}}>{infoClient.clientIdNumber}</span>
                                        </td>
                                        <td style={{width: "40%", verticalAlign: "initial"}}>
                                            <span style={{marginLeft: "0px"}}>{infoClient.clientName}</span>
                                        </td>
                                        <td style={{width: "10%", verticalAlign: "initial"}}>
                                            <span style={{marginLeft: "0px"}}>{infoClient.celulaName}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                {
                                    !isEmpty(infoClient.parameterKeepInMind) && !isEqual('n/a',infoClient.parameterKeepInMind.toLowerCase()) &&
                                    <Row style={{padding: "20px 10px 10px 0px"}}>
                                    <Col xs={12} md={12} lg={12}>
                                     <h3>Tener en cuenta: </h3>
                                        <p style={{textAlign: 'justify'}}>{infoClient.parameterKeepInMind}</p>
                                    </Col>
                                    </Row>
                                }

                                <Row style={{padding: "20px 10px 10px 0px"}}>
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{
                                            fontSize: "25px",
                                            color: "#CEA70B",
                                            marginTop: "5px",
                                            marginBottom: "5px"
                                        }}>
                                            <div className="tab-content-row" style={{
                                                borderTop: "1px dotted #cea70b",
                                                width: "100%",
                                                marginBottom: "10px"
                                            }}/>
                                            <span className="title-middle">Entidades por las que se desea vincular</span>
                                        </div>
                                    </Col>
                                </Row>
                                <LinkEntities />
                                <Row style={{padding: "20px 10px 10px 0px"}}>
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{
                                            fontSize: "25px",
                                            color: "#CEA70B",
                                            marginTop: "5px",
                                            marginBottom: "5px"
                                        }}>
                                            <div className="tab-content-row" style={{
                                                borderTop: "1px dotted #cea70b",
                                                width: "100%",
                                                marginBottom: "10px"
                                            }}/>
                                            <span className="title-middle">Listas de control</span>                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{padding: "20px 10px 10px 0px"}}>
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{
                                            fontSize: "25px",
                                            color: "#CEA70B",
                                            marginTop: "5px",
                                            marginBottom: "5px"
                                        }}>
                                            <div className="tab-content-row" style={{
                                                borderTop: "1px dotted #cea70b",
                                                width: "100%",
                                                marginBottom: "10px"
                                            }}/>
                                            <span className="title-middle">Observaciones</span>                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="modalBt4-footer modal-footer">
                                <button type="submit" className="btn btn-primary modal-button-edit">Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </Col>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

function mapStateToProps({createContactReducer}, ownerProps) {
    return {
        createContactReducer
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ButtonLinkClientComponent);
