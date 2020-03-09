import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { previsitByClientFindServer, clearPrevisit } from '../../previsita/actions';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import { changeIdPrevisit, clearIdPrevisit, changePageAssociateVisit } from '../actions';
import { htmlToText, shorterStringValue, validateResponse } from '../../../actionsGlobal';
import { MESSAGE_LOAD_DATA } from '../../../constantsGlobal';
import PaginationAssociateVisit from './paginationAssociateVisit';
import { Col } from 'react-flexbox-grid';
import { NUMBER_RECORDS } from '../constants';
import Modal from 'react-modal';
import SweetAlert from '../../sweetalertFocus';
import { Button, Icon } from 'semantic-ui-react'
import moment from 'moment';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { changeStateSaveData } from "../../main/actions";
import _ from 'lodash';
import ConfidentialBrandComponent from '../../commercialReport/ConfidentialBrandComponent';

var labelPrevistVist = "En esta sección podrá asociar un informe de previsita (registrado previamente) "
    + "al informe de visita que se esté realizando.\n Asociar una previsita a la visita te permitirá llevar "
    + "trazabilidad entre los informes y se diligenciará automáticamente la información de los participantes, "
    + "fecha y hora de la visita.";

class ButtonAssociateComponent extends Component {

    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._associtate = this._associtate.bind(this);
        this._cancel = this._cancel.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
            show: false,
            showEx: false,
            modalIsOpen: false,
            idPrevisitSeleted: null
        };
    }

    openModal() {
        this.setState({ modalIsOpen: true });
        const { previsitByClientFindServer, clearPrevisit, changePageAssociateVisit, changeStateSaveData } = this.props;
        clearPrevisit();
        changePageAssociateVisit(1);
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        previsitByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, 500, "pvd.visitTime", 1, "", true).then((data) => {
            if (validateResponse(data)) {
                changeStateSaveData(false, "");
            }
        });
    }

    componentWillMount() {
        const { clearIdPrevisit, edit } = this.props;
        if (_.isUndefined(edit) || _.isNull(edit) || !edit) {
            clearIdPrevisit();
        }
    }

    _cancel() {
        this.setState({ show: false });
    }


    buildElementMessage(objective) {
        return <div style={{ textAlign: 'justify' }}>
            <span>{shorterStringValue(htmlToText(objective), 330)}</span>
        </div>
    }

    _renderRow() {
        const { previsitReducer, visitReducer, confidentialReducer } = this.props;
        const data = previsitReducer.get('previsitList');
        const pageAssociateVisit = visitReducer.get('pageAssociateVisit') - 1;
        let isConfidential = confidentialReducer.get('confidential')
        return _.slice(data, pageAssociateVisit * NUMBER_RECORDS, (pageAssociateVisit * NUMBER_RECORDS) + NUMBER_RECORDS)
            .filter((o) => {
                return isConfidential == true && !_.isNull(o.commercialReport) ? o.commercialReport.isConfidential || !o.commercialReport.isConfidential : !o.commercialReport.isConfidential;
            })
            .map((value, index) => {
                var dateVisitFormat = moment(value.datePrevisit).locale('es');
                const label = `${dateVisitFormat.format("DD")}  ${dateVisitFormat.format("MMM")}  ${dateVisitFormat.format("YYYY")} ${dateVisitFormat.format("hh:mm a")} ${(_.isEqual(visitReducer.get('idPrevisit'), value.id) ? "- (Asociada)" : "")}`;
                return (
                    <ToolTipComponent key={index} text={this.buildElementMessage(value.objetive)}
                        position="bottom right" size="tiny">
                        <a className="item">
                            <Button icon onClick={this._openModalAssociate.bind(this, value.id)}>
                                <Icon name='linkify' />
                            </Button>
                            <span style={{ marginLeft: '5pt' }}>{label}</span>
                            {!_.isNull(value.commercialReport) && value.commercialReport.isConfidential ? <ConfidentialBrandComponent /> : ""}
                        </a>
                    </ToolTipComponent>
                );
            });
    }

    _openModalAssociate(id) {
        this.setState({ show: true, idPrevisitSeleted: id });
    }

    _associtate() {
        const { changeIdPrevisit, fnExecute, swtShowMessage } = this.props;
        changeIdPrevisit(this.state.idPrevisitSeleted);
        if (!_.isUndefined(fnExecute) && !_.isNull(fnExecute)) {
            fnExecute();
        }
        swtShowMessage("success", "Previsita asociada", "Señor usuario, la previsita fue asociada correctamente");
        this.setState({ show: false, modalIsOpen: false });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        const { previsitReducer, printMarginRigth } = this.props;

        return (
            <Col xs={4} sm={3} md={2} lg={2}>
                <button type="button" onClick={this.openModal} className={'btn btn-primary modal-button-edit'}
                    style={!_.isUndefined(printMarginRigth) && !_.isNull(printMarginRigth) && printMarginRigth ? { marginRight: '15px', float: 'right', marginTop: '-15px' } : { float: 'right', marginTop: '-15px' }}>Asociar previsita
                </button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog">
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }}
                                    id="myModalLabel">Asociar previsita</h4>
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal"
                                    role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i
                                        className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <div>
                                {previsitReducer.get('rowCount') > 0 ?
                                    <div style={{ margin: '20px 20px 20px 20px' }}>
                                        <span style={{
                                            fontWeight: 'normal',
                                            color: '#4C5360',
                                            textAlign: 'justify'
                                        }}>{labelPrevistVist}</span>
                                        <div className="ui divided selection list"
                                            style={{ marginTop: '20px', border: '1px solid', borderColor: '#DDDDDD' }}>
                                            {this._renderRow()}
                                        </div>
                                        <PaginationAssociateVisit />
                                    </div>
                                    :
                                    <div style={{ margin: '20px 20px 20px 20px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado previsitas a asociar</span>
                                    </div>
                                }
                                <SweetAlert
                                    type="warning"
                                    show={this.state.show}
                                    title="Confirmación asociación"
                                    confirmButtonColor='#DD6B55'
                                    confirmButtonText='Sí, estoy seguro!'
                                    cancelButtonText="Cancelar"
                                    text="Señor usuario ¿Está seguro que desea asociar la previsita seleccionada?"
                                    showCancelButton={true}
                                    onCancel={() => this._cancel()}
                                    onConfirm={() => this._associtate()} />
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
        previsitByClientFindServer,
        clearPrevisit,
        clearIdPrevisit,
        changeIdPrevisit,
        swtShowMessage,
        changeStateSaveData,
        changePageAssociateVisit
    }, dispatch);
}

function mapStateToProps({ previsitReducer, visitReducer, confidentialReducer }, ownerProps) {
    return {
        previsitReducer, visitReducer, confidentialReducer
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ButtonAssociateComponent);
