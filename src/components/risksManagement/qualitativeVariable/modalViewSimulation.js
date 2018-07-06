import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { redirectUrl } from '../../globalComponents/actions';
import { Row, Col } from 'react-flexbox-grid';
import { changeValueModalIsOpen, pdfDescarga, saveClientSurvey, getExistPdfVC } from './actions';
import { formatCurrency } from '../../../actionsGlobal';
import Modal from 'react-modal';
import { get, concat, groupBy, map, mapValues, sum, find, mapKeys, size, sumBy, indexOf, isEqual } from 'lodash';
import { GENERATE_PDF, APP_URL, MESSAGE_REPLACE_PDF } from '../../../constantsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';


const STYLE_TD = {
    borderLeft: '1px solid gray',
    borderColor: 'rgba(34, 36, 38, 0.1)'
};
class ModalViewSimulation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCalculatedResults: [],
            totalSumPoints: 0,
            scoreMax: 0,
            points: 0,
            isPDFGenerated: false
        };
        this.closeModal = this.closeModal.bind(this);
        this._mapFactor = this._mapFactor.bind(this);
        this.buildTableConclusion = this.buildTableConclusion.bind(this);
        this._onClickPDF = this._onClickPDF.bind(this);
        this._dataMapFactor = this._dataMapFactor.bind(this);
        this.functionGeneratePDF = this.functionGeneratePDF.bind(this);
    }

    closeModal() {
        const { changeValueModalIsOpen } = this.props;
        changeValueModalIsOpen(false);
    }

    _onClickPDF() {
        const { qualitativeVariableReducer, swtShowMessage, saveClientSurvey, getExistPdfVC } = this.props;
        const survey = qualitativeVariableReducer.get('survey');

        const jsonClietnSurvey = {
            clientId: window.sessionStorage.getItem('idClientSelected'),
            surveyId: survey.id
        }
        getExistPdfVC(jsonClietnSurvey).then((data) => {
            console.log("data", data);
            if (data.payload.data.data) {
                swtShowMessage(
                    "warning", "Advertencia",
                    MESSAGE_REPLACE_PDF,
                    {
                        onConfirmCallback: this.functionGeneratePDF,
                        onCancelCallback: () => { }
                    },
                    {
                        confirmButtonText: 'Confirmar'
                    }
                );

            } else {
                saveClientSurvey(jsonClietnSurvey);
                this.functionGeneratePDF()
            }
        });


    }

    functionGeneratePDF() {
        const { pdfDescarga, swtShowMessage, clientInformacion, qualitativeVariableReducer } = this.props;
        const listFactor = get(qualitativeVariableReducer.get('survey'), 'listFactor', []);
        const infoClient = clientInformacion.get('responseClientInfo');
        const survey = qualitativeVariableReducer.get('survey');
        var listFactVariables = this._dataMapFactor(listFactor);
        let jsonPDF = Object.assign(listFactVariables, {
            idClient: window.sessionStorage.getItem('idClientSelected'),
            scoreMax: formatCurrency(((this.state.totalSumPoints * 100) / this.state.scoreMax), '0.00') + '%',
            totalSumPoints: this.state.totalSumPoints,
            state: survey.estado,
            latestUpdated: survey.latestUpdated,
            clientName: infoClient.clientName,
            clientNameType: infoClient.clientNameType,
            clientIdNumber: infoClient.clientIdNumber,
            relationshipStatusName: infoClient.relationshipStatusName,
            clientType: infoClient.clientTypeKey

        });
        pdfDescarga(jsonPDF).then((response) => {
            swtShowMessage('success', '', 'PDF generado correctamente');
            this.setState({ isPDFGenerated: true });
            window.open(APP_URL + '/getExcelReport?filename=' + response.payload.data.data.filename + '&id=' + response.payload.data.data.sessionToken, '_blank');
        });
    }

    componentWillReceiveProps(nextProps) {
        const { qualitativeVariableReducer, reducerGlobal } = nextProps;
        if (qualitativeVariableReducer.get('isOpenModalSimulation')) {
            let sumScoreFactor = 0;
            const listQuestions = concat(qualitativeVariableReducer.get('listQuestionsCommercial'), qualitativeVariableReducer.get('listQuestionsAnalyst'));
            //Agrupo las preguntas con variable
            let listQuestionsGroup = groupBy(listQuestions, 'idVariable');
            //Recorro cada variable, obteniendo por cada pregunta el score de la respuesta y retorno la suma de score por variable
            listQuestionsGroup = mapValues(listQuestionsGroup, (value, key) => {
                const listScores = map(value, question => {
                    return get(find(question.listAnswerOption, ['id', question.idAnswer]), 'score');
                });
                return sum(listScores);
            });
            //Obtengo las variables de los factores
            let listVaribles = [];
            map(get(qualitativeVariableReducer.get('survey'), 'listFactor'), factor => {
                listVaribles = concat(listVaribles, factor.listVariables);
            });
            //Sumo el total de puntos de las variables para sacar el promedio
            let scoreMaxAverage = sumBy(listVaribles, 'scoreMax');
            //Valido la suma de las respuestas de la varibale con los rangos y obtengo la conclusión
            listQuestionsGroup = mapValues(listQuestionsGroup, (sumScoreByVariable, key) => {
                const answer = find(listVaribles, ['id', parseInt(key)]);
                const range = find(answer.scoreVariable, rangeScore => {
                    return sumScoreByVariable >= rangeScore.assignmentMin && sumScoreByVariable <= rangeScore.assignmentMax;
                });
                sumScoreFactor += get(range, 'score', 0);
                return get(range, 'name', '');
            });
            this.setState({
                listCalculatedResults: listQuestionsGroup,
                totalSumPoints: sumScoreFactor,
                scoreMax: scoreMaxAverage
            });
        }
    }

    buildTableConclusion() {
        const { qualitativeVariableReducer } = this.props;
        const listFactor = get(qualitativeVariableReducer.get('survey'), 'listFactor', []);
        return <Row>
            <Col xs={12} sm={12} lg={12} style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <table className="ui striped table" style={{ width: '100%' }}>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'center' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '13pt' }}>Resumen</span>
                        </td>
                    </tr>
                    <tr>
                        <td><span style={{ fontWeight: 'bold' }}>Factor</span></td>
                        <td><span style={{ fontWeight: 'bold' }}>Variable</span></td>
                        <td><span style={{ fontWeight: 'bold' }}>Conclusión</span></td>
                    </tr>
                    {listFactor.map(this._mapFactor)}
                    <tr>
                        <td colSpan={3} style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 'bold' }}>Puntos: {this.state.totalSumPoints}</span>
                        </td>
                    </tr>
                </table>
            </Col>
        </Row>
    }

    _dataMapFactor(listFactor) {
        return {
            listFactVariables: listFactor.map(factor => {
                return {
                    factor: factor.name,
                    variables: factor.listVariables.map(variable => {
                        return {
                            name: variable.name,
                            resume: get(this.state.listCalculatedResults, variable.id)
                        }
                    })
                }
            })

        }
    }

    _mapFactor(factor, idx) {
        let firstReg = true;
        return map(factor.listVariables, variable => {
            if (firstReg) {
                firstReg = false;
                return <tr>
                    <td rowSpan={size(factor.listVariables)} style={{ verticalAlign: 'middle' }} > {factor.name}</td >
                    <td style={STYLE_TD}>{variable.name}</td>
                    <td style={STYLE_TD}>{get(this.state.listCalculatedResults, variable.id)}</td>
                </tr >
            } else {
                return <tr>
                    <td style={STYLE_TD}>{variable.name}</td>
                    <td style={STYLE_TD}>{get(this.state.listCalculatedResults, variable.id)}</td>
                </tr>
            }
        });
    }

    render() {
        const { qualitativeVariableReducer, reducerGlobal } = this.props;
        const generatePDF = get(reducerGlobal.get('permissionsQualitativeV'), indexOf(reducerGlobal.get('permissionsQualitativeV'), GENERATE_PDF), false);
        return (
            <Modal
                isOpen={qualitativeVariableReducer.get('isOpenModalSimulation')}
                onRequestClose={this.closeModal}
                className="modalBt4-fade modal fade contact-detail-modal in">
                <div className="modalBt4-dialog modalBt4-lg">
                    <div className="modalBt4-content modal-content">
                        <div className="modalBt4-header modal-header">
                            <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Simulación de encuesta</h4>
                            <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                                <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                        <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ overflowX: 'hidden' }}>
                            <div style={{ textAlign: "right", marginRight: '20px', marginTop: '10px', marginBottom: '5px' }}>
                                <span style={{ color: "#818282", paddingRight: '10px', fontSize: '12pt' }}>Puntos asignados: {formatCurrency(((this.state.totalSumPoints * 100) / this.state.scoreMax), '0.00')}%</span>
                            </div>
                            {this.buildTableConclusion()}
                        </div>
                        <div className="modalBt4-footer modal-footer">
                            {isEqual(generatePDF, GENERATE_PDF) ?
                                <button type="button" onClick={this._onClickPDF} className="btn btn-primary modal-button-edit">
                                    <span>Descargar PDF</span>
                                </button>
                                :
                                ''
                            }
                            <button type="button" onClick={this.closeModal} className="btn btn-primary modal-button-edit">
                                <span>Aceptar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };
}



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeValueModalIsOpen,
        pdfDescarga,
        swtShowMessage,
        saveClientSurvey,
        getExistPdfVC
    }, dispatch);
}

function mapStateToProps({ reducerGlobal, qualitativeVariableReducer, clientInformacion }, ownerProps) {
    return {
        reducerGlobal,
        qualitativeVariableReducer,
        clientInformacion
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ModalViewSimulation);
