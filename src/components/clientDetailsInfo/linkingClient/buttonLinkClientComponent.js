/**
 * Created by Andres Hurtado on 15/03/2017.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import {Row, Col} from 'react-flexbox-grid';
import LinkEntities from './linkEntitiesComponent/linkEntities';
import Modal from 'react-modal';
import {isEmpty, isEqual, get, find} from 'lodash';
import Textarea from '../../../ui/textarea/textareaComponent';
import {setEntities, clearEntities, saveLinkClient} from './linkEntitiesComponent/actions';
import {updateErrorsLinkEntities} from '../../clientDetailsInfo/actions';
import {ENTITY_BANCOLOMBIA, ENTITY_VALORES_BANCOLOMBIA, START_STATUS} from './linkEntitiesComponent/constants';
const fields = ["observationTrader"];
const errors = {};
import {swtShowMessage} from '../../sweetAlertMessages/actions';
import {FILTER_TYPE_LBO_ID} from '../../selectsComponent/constants';
import {getMasterDataFields} from '../../selectsComponent/actions';
import {updateFieldInfoClient} from '../../clientInformation/actions';
import {consultStateBlackListClient, updateValuesBlackList} from './actions';
import {showLoading} from '../../loading/actions';
import {consultInfoClient} from '../../clientInformation/actions';

const validate = (values) => {
    return errors;
};

class ButtonLinkClientComponent extends Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this._handleSaveLinkingClient = this._handleSaveLinkingClient.bind(this);
        this._getListEntities = this._getListEntities.bind(this);
        this.state = {
            modalIsOpen: false
        };
    }

    openModal() {
        this.setState({modalIsOpen: true});
        const {
            consultStateBlackListClient, infoClient,
            showLoading, swtShowMessage, setEntities,
            getMasterDataFields, selectsReducer,
            updateValuesBlackList,consultInfoClient
        } = this.props;
        const jsonClientInfo = {
            customerId: get(infoClient, 'clientIdNumber'),
            customerFullName: get(infoClient, 'clientName'),
            customerTypeId: get(infoClient, 'clientNameType')
        };
        this._getListEntities();
        updateValuesBlackList(get(infoClient, 'levelBlackList'), get(infoClient, 'messageBlackList'));
        /** Se realiza el llamado de listas de control uno a uno para la vinculación **/
        showLoading(true,'Cargando...');
        consultInfoClient();
        consultStateBlackListClient(jsonClientInfo).then((data)=>{
            showLoading(false,'');
            if(!isEqual(get(data,'payload.data.status'),200)){
                updateValuesBlackList(get(infoClient, 'levelBlackList'), get(infoClient, 'messageBlackList'));
                console.log("Error ",get(data,'payload.data.data'));
                swtShowMessage('error', 'Vinculación', 'Señor usuario, ocurrió un error consultando el cliente en listas de control.');
            }
        },(reason) => {
            updateValuesBlackList(get(infoClient, 'levelBlackList'), get(infoClient, 'messageBlackList'));
            console.log("reason consultState BlackListClient ",reason);
            showLoading(false,'');
            swtShowMessage('error', 'Vinculación', 'Señor usuario, ocurrió un error consultando el cliente en listas de control.');
        });
    }

    closeModal() {
        this.setState({modalIsOpen: false});
        this.props.updateValuesBlackList(null, null);
    }

    _handleSaveLinkingClient() {
        const {
            fields:{observationTrader}, infoClient,
            linkEntitiesClient, updateErrorsLinkEntities,
            swtShowMessage, saveLinkClient, showLoading, updateFieldInfoClient,
            message, level,consultInfoClient
        } = this.props;
        updateErrorsLinkEntities(false);
        let isValidLinkEntities = true;
        const newListEntities = linkEntitiesClient.map(linkEntity => {
            if (isEqual(linkEntity.entity, "") || isEqual(linkEntity.entity, null)) {
                updateErrorsLinkEntities(true);
                isValidLinkEntities = false;
            }
            if (isValidLinkEntities) {
                if (isEqual(ENTITY_BANCOLOMBIA.toLowerCase(), linkEntity.entityText.toLowerCase())
                    || isEqual(ENTITY_VALORES_BANCOLOMBIA.toLowerCase(), linkEntity.entityText.toLowerCase())) {
                    if (isEmpty(linkEntity.traderCode)) {
                        updateErrorsLinkEntities(true);
                        isValidLinkEntities = false;
                    }
                    return {
                        id: linkEntity.idEntity,
                        entity: linkEntity.entity,
                        traderCode: linkEntity.traderCode
                    }
                } else {
                    return {
                        id: linkEntity.idEntity,
                        entity: linkEntity.entity,
                        traderCode: null
                    }
                }
            } else {
                return {
                    entity: null,
                    traderCode: null
                }
            }
        });
        if (linkEntitiesClient.size == 0) {
            swtShowMessage('error', 'Vinculación', 'Señor usuario, debe ingresar por lo menos una entidad a vincular.');
        } else if (!isValidLinkEntities) {
            swtShowMessage('error', 'Vinculación', 'Señor usuario, por favor ingrese todos los campos obligatorios.');
        } else {
            const jsonLinkEntityClient = {
                "idClient": infoClient.id,
                "observationTrader": observationTrader.value,
                "linkEntity": newListEntities.toArray(),
                "levelBlackList": level,
                "messageBlackList": message
            };
            showLoading(true, 'Guardando..');
            saveLinkClient(jsonLinkEntityClient)
                .then((data) => {
                    if ((_.get(data, 'payload.data.responseSaveLinkingClient') === "save")) {
                        consultInfoClient();
                        showLoading(false, '');
                        this.closeModal();
                        swtShowMessage('success', 'Vinculación', 'Señor usuario, la vinculación se guardó exitosamente.');
                    } else {
                        showLoading(false, '');
                        swtShowMessage('error', 'Vinculación', 'Señor usuario, ocurrió un error guardando la vinculación.');
                    }
                });

        }
    }

    _getListEntities() {
        const {infoClient, clearEntities,setEntities} = this.props;
        const listLinkEntitiesClient = get(infoClient, 'linkEntity', []);
        clearEntities();
        setEntities(listLinkEntitiesClient);
    }

    componentWillMount() {
        const {getMasterDataFields} = this.props;
        getMasterDataFields([FILTER_TYPE_LBO_ID]);
        this._getListEntities();
    }

    componentWillUnmount() {
        this.props.clearEntities();
    }

    render() {
        const {infoClient, fields:{observationTrader}, handleSubmit, message, level} = this.props;
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
                                <button type="button" onClick={this.closeModal} className="close"
                                        data-dismiss="modal"
                                        role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i
                                        className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                                 style={{padding: '20px 20px 20px 20px'}} id="containerModal">
                                <table style={{width: "100%"}}>
                                    <thead>
                                    <tr>
                                        <th><span
                                            style={{fontWeight: "bold", color: "#4C5360"}}>Tipo de documento</span>
                                        </th>
                                        <th><span
                                            style={{
                                                fontWeight: "bold",
                                                color: "#4C5360"
                                            }}>Número de documento</span>
                                        </th>
                                        <th><span
                                            style={{
                                                fontWeight: "bold",
                                                color: "#4C5360"
                                            }}>Nombre/Razón social</span>
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
                                    !isEmpty(infoClient.parameterKeepInMind) && !isEqual('n/a', infoClient.parameterKeepInMind.toLowerCase()) &&
                                    <Row style={{padding: "20px 10px 10px 0px"}}>
                                        <Col xs={12} md={12} lg={12}>
                                            <h3>Tener en cuenta</h3>
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
                                            <span
                                                className="title-middle">Entidades por las que se desea vincular</span>
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
                                            <span className="title-middle">Listas de control</span></div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={2} lg={2}>
                                        <h4>Nivel</h4>
                                        <span>{level}</span>
                                    </Col>
                                    <Col xs={12} md={10} lg={10}>
                                        <h4>Mensaje</h4>
                                        <span>
                                            {message}
                                        </span>
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
                                            <span className="title-middle">Observaciones</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={12} lg={12}>
                                        <h4>Observación vinculación</h4>
                                        {_.isEmpty(infoClient.observationAdmin) ?
                                            <p>Sin observación.</p>
                                            :
                                            <p style={{textAlign: 'justify'}}>{infoClient.observationAdmin}</p>
                                        }
                                    </Col>
                                </Row>
                                <Row style={{paddingTop: '10px'}}>
                                    <Col xs={12} md={12} lg={12}>
                                        <h4>Observación</h4>
                                        <div>
                                            <Textarea
                                                name="actionArea"
                                                type="text"
                                                style={{width: '100%', height: '100%', textAlign: 'justify'}}
                                                max="500"
                                                rows={3}
                                                {...observationTrader}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="modalBt4-footer modal-footer">
                                <button type="button" onClick={this._handleSaveLinkingClient}
                                        className="btn btn-primary modal-button-edit">Guardar
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
    return bindActionCreators({
        setEntities,
        clearEntities,
        updateErrorsLinkEntities,
        swtShowMessage,
        saveLinkClient,
        getMasterDataFields,
        updateFieldInfoClient,
        consultStateBlackListClient,
        showLoading,
        updateValuesBlackList,
        consultInfoClient
    }, dispatch);
}

function mapStateToProps({linkEntitiesClient, tabReducer, selectsReducer, blackListClient}, {infoClient}) {
    const isValidLinkEntities = !tabReducer.get('errorEditLinkEntitiesClient');
    const message = _.isEmpty(blackListClient.get('message')) ? '' : blackListClient.get('message');
    const level = _.isEmpty(blackListClient.get('level')) ? '' : blackListClient.get('level');
    if (isEmpty(get(infoClient, 'observationTrader', null))) {
        return {
            message,
            level,
            selectsReducer,
            linkEntitiesClient,
            isValidLinkEntities,
            infoClient,
            initialValues: {
                observationTrader: ''
            }
        };
    } else {
        return {
            message,
            level,
            selectsReducer,
            linkEntitiesClient,
            isValidLinkEntities,
            infoClient,
            initialValues: {
                observationTrader: get(infoClient, 'observationTrader', null)
            }
        };
    }

}

export default reduxForm({
    form: 'submitModalLinkClient',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(ButtonLinkClientComponent);