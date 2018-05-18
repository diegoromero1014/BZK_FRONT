import React from 'react';
import {connect} from 'react-redux'

import {Col, Row} from "react-flexbox-grid";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";

class ActividadEconomica extends React.Component {

    constructor(props) {
        super(props)

        this._onChangeCIIU = this._onChangeCIIU.bind(this);

    }
    
    _onChangeCIIU(val) {
        const { idCIIU, idSubCIIU } = this.props;
        idCIIU.onChange(val);
    }

    render() {

        const { idCIIU, selectsReducer, isExclient } = this.props;

        return (
            <div>
            <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="payment icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Actividad económica</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 0px" }}>
                    
                    <Col xs>
                        <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                            <dt><span>CIIU</span>{!isExclient && <span style={{ color: "red" }}>*</span> }</dt>
                            <ComboBox
                                name="idCIIU"
                                labelInput="Seleccione CIIU..."
                                {...idCIIU}
                                onChange={val => this._onChangeCIIU(val)}
                                onBlur={idCIIU.onBlur}
                                valueProp={'id'}
                                textProp={'ciiu'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('dataCIIU')}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                    <Col xs>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                            <dt style={{ paddingBottom: "10px" }}><span>Sector</span></dt>
                            <span style={{ width: "25%", verticalAlign: "initial", paddingTop: "5px" }}>
                                {(idCIIU.value !== "" && idCIIU.value !== null && idCIIU.value !== undefined && !_.isEmpty(selectsReducer.get('dataCIIU'))) ? _.get(_.filter(selectsReducer.get('dataCIIU'), ['id', parseInt(idCIIU.value)]), '[0].economicSector') : ''}
                            </span>
                        </div>
                    </Col>
                </Row>
                </div>
        )

    }
}

function mapStateToProps({selectsReducer}) {
    return {
        selectsReducer
    }
}

export default connect(mapStateToProps, {})(ActividadEconomica)