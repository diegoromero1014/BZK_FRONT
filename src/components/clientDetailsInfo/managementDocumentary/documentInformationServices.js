import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultManagementDocumentaryService, clearManagementDocumentary} from '../actions';
import {changeStateSaveData} from '../../main/actions';
import {CONSUMING_SERVICE} from '../../../constantsGlobal';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SweetAlert from '../../sweetalertFocus';
import {shorterStringValue} from '../../../actionsGlobal';
import Tooltip from '../../toolTip/toolTipComponent';
import _ from 'lodash';

class DocumentInformationServices extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEr: false,
        };
        this.consultManagementDocumentary = this.consultManagementDocumentary.bind(this);
        this._createDocumentsRecords = this._createDocumentsRecords.bind(this);
    }

    componentWillMount() {
        const {clearManagementDocumentary} = this.props;
        clearManagementDocumentary();
    }

    consultManagementDocumentary() {
        const {consultManagementDocumentaryService, changeStateSaveData} = this.props;
        changeStateSaveData(true, CONSUMING_SERVICE);
        consultManagementDocumentaryService().then((data) => {
            changeStateSaveData(false, "");
            if (_.get(data, 'payload.data.status', 500) === 500) {
                this.setState({showEr: true});
            }
        }, (reason) => {
            changeStateSaveData(false, "");
            this.setState({showEr: true});
        });
    }

    _createDocumentsRecords(document, idx) {
        var splitDocumentName = _.capitalize(shorterStringValue(document.documentName, 30));

        return <tr key={idx}>
            <td><Tooltip text={_.capitalize(document.documentName)}>
                {_.isUndefined(document.url) || _.isNull(document.url) || _.isEmpty(document.url) ?
                    <span>{splitDocumentName}</span>
                    :
                    <a style={{cursor: 'pointer', textDecoration: 'underline'}}
                       onClick={() => window.open(document.url, '_blank')}>{splitDocumentName}</a>
                }
            </Tooltip>
            </td>
            <td>{_.capitalize(document.documentType)}</td>
            <td>{_.capitalize(document.documentStatus)}</td>
            <td>{_.capitalize(document.obligatory)}</td>
            <td>{document.expiryDate}</td>
        </tr>
    }


    render() {
        const {tabReducer} = this.props;
        return (
            <div>
                <table style={{width: "100%", marginBottom: '15px'}}>
                    <tbody>
                    <tr>
                        <td>
                            <a style={{cursor: 'pointer', textDecoration: 'underline'}}
                               onClick={this.consultManagementDocumentary}>Consultar</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                {tabReducer.get('listDocumentsManagementDocumentary') !== undefined && tabReducer.get('listDocumentsManagementDocumentary') !== null ?
                    <div>
                        <table style={{width: "100%"}}>
                            <thead>
                            <tr>
                                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Nombre</span></th>
                                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Tipo</span></th>
                                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Estado</span></th>
                                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Obligatoriedad</span></th>
                                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Fecha de expiración</span></th>
                            </tr>
                            </thead>
                            <tbody>
                            {tabReducer.get('listDocumentsManagementDocumentary').map(this._createDocumentsRecords)}
                            </tbody>
                        </table>
                    </div>
                    :
                    <Grid style={{width: "100%", marginTop: '15px'}}>
                        <Row center="xs">
                            <Col xs={12} sm={8} md={12} lg={12}>
                                <span style={{
                                    fontWeight: 'bold',
                                    color: '#4C5360'
                                }}>No hay documentos para el cliente</span>
                            </Col>
                        </Row>
                    </Grid>
                }

                <SweetAlert
                    type="error"
                    show={this.state.showEr}
                    title="Error consultando documentos"
                    text="Señor usuario, ocurrió un error tratando de consultar los documentos del cliente."
                    onConfirm={() => this.setState({showEr: false})}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispacth) {
    return bindActionCreators({
        consultManagementDocumentaryService,
        clearManagementDocumentary,
        changeStateSaveData
    }, dispacth);
}

function mapStateToProps({reducerGlobal, tabReducer}) {
    return {
        reducerGlobal,
        tabReducer
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentInformationServices);