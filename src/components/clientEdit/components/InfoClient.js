import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import _ from "lodash";
import { Col, Row } from "react-flexbox-grid";
import Input from "../../../ui/input/inputComponent";
import Textarea from "../../../ui/textarea/textareaComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import ClientTypology from "../../contextClient/clientTypology";
import * as constants from "../../selectsComponent/constants";
import { getMasterDataFields, consultListWithParameterUbication, consultListByCatalogType } from '../../selectsComponent/actions';
import { TITLE_DESCRIPTION, GOVERNMENT, FINANCIAL_INSTITUTIONS } from '../constants';

export class InfoClient extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            subSegments : []
        }

        this._changeCatalogSubsegment = this._changeCatalogSubsegment.bind(this);
        this._changeSegment = this._changeSegment.bind(this);
        this._checkSubSegmentRender = this._checkSubSegmentRender.bind(this);

        this.firstChange = false;

    }

    _checkSubSegmentRender() {
        const { selectsReducer, clientInformacion } = this.props;

        if (!this.firstChange && typeof selectsReducer.get(constants.SEGMENTS) != 'undefined' && selectsReducer.get(constants.SEGMENTS).length > 0) {
            this.firstChange = true;
            const infoClient = clientInformacion.get('responseClientInfo');
            this._changeSegment(infoClient.segment, true, infoClient.subSegment);
        }
    }

    componentWillMount() {
        this._checkSubSegmentRender();
    }

    componentDidUpdate() {
        this._checkSubSegmentRender();
    }

    _changeCatalogSubsegment(segment, subSegment){
        const { consultListByCatalogType, clientInformacion } = this.props;
        consultListByCatalogType(constants.SUBSEGMENTS, segment.value, constants.SUBSEGMENTS).then((data) => {
            this.setState({
                subSegments: _.get(data, 'payload.data.data', [])
            });
        });

        if (!_.isEqual(clientInformacion.get('responseClientInfo').segment, segment.value)) {
            subSegment.onChange('');
        } else {
            subSegment.onChange(subSegment.value);
        }
    }

    _changeSegment(idSegment, firstConsult) {
        const { segment, subSegment, customerTypology, selectsReducer, getMasterDataFields, consultListWithParameterUbication } = this.props;
        const value = _.get(_.find(selectsReducer.get(constants.SEGMENTS), ['id', parseInt(idSegment)]), 'value');
        segment.onChange(idSegment);

        this._changeCatalogSubsegment(segment, subSegment);

        if (!_.isUndefined(value)) {
            if (_.isEqual(GOVERNMENT, value) || _.isEqual(FINANCIAL_INSTITUTIONS, value)) {
                consultListWithParameterUbication(constants.CUSTOMER_TYPOLOGY, idSegment);
            } else {
                getMasterDataFields([constants.CUSTOMER_TYPOLOGY], true);
            }
            if (!firstConsult) {
                customerTypology.onChange('');
            }
        }
    }

    render() {

        const { razonSocial, idTypeClient, idNumber, segment, subSegment, description, customerTypology, idButton, selectsReducer, isPersonaNatural } = this.props;

        return (
            <Row style={{ padding: "10px 28px 10px 20px" }}>
                <Col xs={12} md={4} lg={4}>
                    <dt><span>Razón social (</span><span style={{ color: "red" }}>*</span>)</dt>
                    <dt>
                        <Input
                            name="razonSocial"
                            type="text"
                            max="150"
                            placeholder="Razón social del cliente"
                            {...razonSocial}
                        />
                    </dt>
                </Col>
                <Col xs={12} md={4} lg={4}>
                    <dt><span>Tipo de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                    <dt>
                        <ComboBox
                            name="tipoDocumento"
                            labelInput="Tipo de documento del cliente"
                            {...idTypeClient}
                            value={idTypeClient.value}
                            onBlur={idTypeClient.onBlur}
                            valueProp={'id'}
                            textProp={'value'}
                            parentId="dashboardComponentScroll"
                            data={isPersonaNatural ? selectsReducer.get(constants.CONTACT_ID_TYPE) : selectsReducer.get(constants.CLIENT_ID_TYPE)}
                            touched={true}
                        />
                    </dt>
                </Col>
                <Col xs={12} md={4} lg={4}>
                    <dt><span>Número de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                    <dt>
                        <Input
                            name="documento"
                            type="text"
                            max="30"
                            placeholder="Número de documento del cliente"
                            {...idNumber}
                            touched={true}
                        />
                    </dt>
                </Col>
                <Col xs={12} md={4} lg={4}>
                    <div style={{ marginTop: "10px" }}>
                        <dt><span>Segmento (</span><span style={{ color: "red" }}>*</span>)</dt>
                        <ComboBox
                            name="segment"
                            labelInput="Segmento"
                            {...segment}
                            value={segment.value}
                            onBlur={segment.onBlur}
                            valueProp={'id'}
                            textProp={'value'}
                            style={{ marginBottom: '0px !important' }}
                            parentId="dashboardComponentScroll"
                            data={selectsReducer.get(constants.SEGMENTS)}
                            onChange={(val) => this._changeSegment(val, false, null)}
                            touched={true}
                        />
                    </div>
                </Col>
                <Col xs={12} md={4} lg={4}>
                        <div style={{ marginTop: "10px" }}>
                            <dt><span>Subsegmento</span></dt>
                            <ComboBox
                                name="subSegment"
                                labelInput="Sebsegmento"
                                {...subSegment}
                                value={subSegment.value}
                                onBlur={subSegment.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={this.state.subSegments}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
            
                <ClientTypology customerTypology={customerTypology}
                    data={selectsReducer.get(constants.CUSTOMER_TYPOLOGY)} />

                <Col xs={12} md={12} lg={12}>
                    <div style={{ marginTop: "10px" }}>
                        <dt>
                            <span>Breve descripción de la empresa</span>
                            <i className="help circle icon blue"
                                style={{ fontSize: "15px", cursor: "pointer", marginLeft: "2px" }}
                                title={TITLE_DESCRIPTION} />
                        </dt>
                        <dt>
                            <Textarea
                                name="description"
                                type="text"
                                style={{ width: '100%', height: '100%' }}
                                onChange={val => this._onchangeValue("description", val)}
                                placeholder="Ingrese la descripción"
                                rows={4}
                                {...description}
                            />
                        </dt>
                    </div>
                </Col>
            </Row>
        )

    }

}

function mapStateToProps({ selectsReducer, clientInformacion }) {
    return {
        selectsReducer,
        clientInformacion
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getMasterDataFields,
        consultListWithParameterUbication,
        consultListByCatalogType
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(InfoClient);