import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { consultManagementDocumentaryService } from '../actions';
import { Grid, Row, Col } from 'react-flexbox-grid';

class DocumentInformationServices extends Component {

    constructor(props) {
        super(props);
        this.consultManagementDocumentary = this.consultManagementDocumentary.bind(this);
        this._createDocumentsRecords = this._createDocumentsRecords.bind(this);
    }

    consultManagementDocumentary() {
        const { consultManagementDocumentaryService } = this.props;
        consultManagementDocumentaryService();
    }

    _createDocumentsRecords(document, idx) {
        return <tr key={idx}>
            <td>{document.id}</td>
            <td>
                <a style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.open(document.url, '_blank')}>{document.name}</a>
            </td>
            <td>{document.type}</td>
            <td>{document.status}</td>
            <td>{document.code}</td>

        </tr>
    }

    render() {
        const { tabReducer } = this.props;
        return (
            <div className="tab-content-row" style={{ marginTop: "30px", borderTop: "1px dotted #cea70b" }}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <dl style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                                    <i className="newspaper icon" style={{ fontSize: "25px" }}></i>
                                    <span className="title-middle"> Consulta de servicios de Información Documental</span>
                                </dl>
                            </td>
                            <td>
                                <a style={{ cursor: 'pointer', textDecoration: 'underline', marginLeft: '15px' }} onClick={this.consultManagementDocumentary}>Consultar</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {tabReducer.get('listDocumentsManagementDocumentary') !== undefined && tabReducer.get('listDocumentsManagementDocumentary') !== null ?
                    <div>
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Id</span></th>
                                    <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Nombre</span></th>
                                    <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Tipo</span></th>
                                    <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Estado</span></th>
                                    <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Código</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tabReducer.get('listDocumentsManagementDocumentary').map(this._createDocumentsRecords)}
                            </tbody>
                        </table>
                    </div>
                    :
                    <Grid style={{width: "100%", marginTop: '15px' }}>
                        <Row center="xs">
                            <Col xs={12} sm={8} md={12} lg={12}>
                                <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No hay documentos para el cliente</span>
                            </Col>
                        </Row>
                    </Grid>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispacth) {
    return bindActionCreators({
        consultManagementDocumentaryService
    }, dispacth);
}

function mapStateToProps({ reducerGlobal, tabReducer }) {
    return {
        reducerGlobal,
        tabReducer
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentInformationServices);