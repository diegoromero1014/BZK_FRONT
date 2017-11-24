import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../../globalComponents/actions';
import {updateTitleNavBar} from '../../navBar/actions';
import {
    draftsDocumentsByUser,
    clearDraftDocumentOrder,
    clearDraftDocumentPaginator,
    clearDraftDocument
} from './actions';
import ListDraftDocuments from './listDraftDocuments';
import PaginationDraftDocument from './paginationDraftDocuments';
import {NUMBER_RECORDS} from './constants';
import _ from 'lodash';
import {showLoading} from '../../loading/actions';
import {MESSAGE_LOAD_DATA} from '../../../constantsGlobal';

class ModalDraftDocuments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keywordDraftDocument: '',
        };
        this.consultInfoDraftDocuments = this.consultInfoDraftDocuments.bind(this);
        this._handleDraftDocumentsFind = this._handleDraftDocumentsFind.bind(this);
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    _handleChangeKeyword(e) {
        if (e.keyCode === 13 || e.which === 13) {
            this.consultInfoDraftDocuments();
        } else {
            this.setState({
                keywordDraftDocument: e.target.value
            });
        }
    }

    componentWillMount() {
        const {clearDraftDocument, updateTitleNavBar} = this.props;
        clearDraftDocument();
        this.consultInfoDraftDocuments();
        updateTitleNavBar("Mis documentos en borrador");
    }

    consultInfoDraftDocuments() {
        const {draftsDocumentsByUser, clearDraftDocumentPaginator, showLoading} = this.props;
        clearDraftDocumentPaginator();
        showLoading(true, MESSAGE_LOAD_DATA);
        draftsDocumentsByUser(0, NUMBER_RECORDS, this.state.keywordDraftDocument).then((data) => {
            showLoading(false, '');
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
        });
    }

    _handleDraftDocumentsFind() {
        const {draftsDocumentsByUser, clearDraftDocumentPaginator, clearDraftDocumentOrder, showLoading} = this.props;
        clearDraftDocumentPaginator();
        clearDraftDocumentOrder();
        showLoading(true, MESSAGE_LOAD_DATA);
        draftsDocumentsByUser(0, NUMBER_RECORDS, this.state.keywordDraftDocument, null, "").then((data) => {
            showLoading(false, '');
        });
    }

    _cleanSearch() {
        this.setState({keywordDraftDocument: ""});
        const {draftsDocumentsByUser, clearDraftDocumentPaginator, clearDraftDocumentOrder, showLoading} = this.props;
        clearDraftDocumentPaginator();
        clearDraftDocumentOrder();
        showLoading(true, MESSAGE_LOAD_DATA);
        draftsDocumentsByUser(0, NUMBER_RECORDS, "", null, "").then((data) => {
            showLoading(false, '');
        });
    }

    render() {
        const {draftDocumentsReducer} = this.props;
        let visibleTable = 'none';
        let visibleMessage = 'block';
        if (draftDocumentsReducer.get('rowCount') !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        return (
            <div className="tab-pane quickZoomIn animated"
                 style={{width: "100%", marginTop: "10px", marginBottom: "20px"}}>
                <div style={{padding: '10px', overflow: 'initial'}}>
                    <Row style={{borderBottom: "2px solid #D9DEDF"}}>
                        <Col xs={12} sm={12} md={8} lg={8}>
                            <div className="InputAddOn">
                                <input type="text" style={{padding: '0px 11px !important'}}
                                       id="searchExpression" onKeyPress={this._handleChangeKeyword}
                                       placeholder="Búsqueda por informe, tipo de documento, número de documento y nombre del cliente"
                                       value={this.state.keywordDraftDocument}
                                       onChange={this._handleChangeKeyword}
                                       className="input-lg input InputAddOn-field"
                                />
                                <button id="searchClients" className="btn"
                                        title="Búsqueda por informe, tipo de documento, número de documento y nombre del cliente"
                                        type="button"
                                        onClick={this._findForKeyword} style={{backgroundColor: "#E0E2E2"}}>
                                    <i className="search icon" style={{margin: '0em', fontSize: '1.2em'}}/>
                                </button>
                            </div>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} style={{width: '100%'}}>
                            <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                    title="Limpiar búsqueda" style={{marginLeft: "17px"}}>
                                <i className="erase icon"
                                   style={{color: "white", margin: '0em', fontSize: '1.2em'}}/>
                            </button>
                        </Col>
                    </Row>
                </div>
                <Grid style={{display: visibleTable, width: "100%", marginBottom: '10px'}}>
                    <Row style={{backgroundColor: 'white', marginLeft: '10px', marginRight: '10px'}}>
                        <Col style={{width: '100%'}}>
                            <ListDraftDocuments keyWordParameter={this.state.keywordDraftDocument}/>
                            <div style={{marginBottom: '10px'}}>
                                <PaginationDraftDocument keyWordParameter={this.state.keywordDraftDocument}/>
                            </div>
                        </Col>
                    </Row>
                </Grid>
                <Grid style={{display: visibleMessage, width: "100%"}}>
                    <Row center="xs">
                        <Col xs={12} sm={8} md={12} lg={12}>
                            <span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        redirectUrl,
        clearDraftDocument,
        draftsDocumentsByUser,
        clearDraftDocumentOrder,
        clearDraftDocumentPaginator,
        updateTitleNavBar,
        showLoading
    }, dispatch);
}

function mapStateToProps({draftDocumentsReducer}, ownerProps) {
    return {
        draftDocumentsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDraftDocuments);
