import React from 'react'

import Input from "../../../ui/input/inputComponent";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import {Col, Row} from "react-flexbox-grid";

import {ONLY_POSITIVE_INTEGER, ALLOWS_NEGATIVE_INTEGER, DATE_REQUIERED, OPTION_REQUIRED, 
    VALUE_REQUIERED, VALUE_XSS_INVALID} from "../../../constantsGlobal"

import {xssValidation} from "../../../actionsGlobal";

import numeral from "numeral";

class InfoFinanciera extends React.Component {


    _handleBlurValueNumber(typeValidation, valuReduxForm, val) {
        var pattern;
        //Elimino los caracteres no validos
        for (var i = 0, output = '', validos = "-0123456789"; i < (val + "").length; i++) {
            if (validos.indexOf(val.toString().charAt(i)) !== -1) {
                output += val.toString().charAt(i)
            }
        }
        val = output;

        if (typeValidation === ALLOWS_NEGATIVE_INTEGER) {
            pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(val)) {
                val = val.replace(pattern, "$1,$2");
            }
            valuReduxForm.onChange(val);
        } else {
            var value = numeral(valuReduxForm.value).format('0');
            if (value >= 0) {
                pattern = /(-?\d+)(\d{3})/;
                while (pattern.test(val)) {
                    val = val.replace(pattern, "$1,$2");
                }
                valuReduxForm.onChange(val);
            } else {
                valuReduxForm.onChange("");
            }
        }
    }

    render () {
        const { isExclient, annualSales, dateSalesAnnuals, assets, liabilities, operatingIncome, expenses, nonOperatingIncome } = this.props;

        return (
            <div>
            <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="suitcase icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Información financiera</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Ventas anuales</span>
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                type="text"
                                min={0}
                                max="16"
                                placeholder="Ingrese las ventas anuales"
                                {...annualSales}
                                value={annualSales.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, annualSales, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Fecha de ventas anuales - DD/MM/YYYY</span>
                        </dt>
                        <dt>
                            <DateTimePickerUi culture='es' format={"DD/MM/YYYY"} time={false} {...dateSalesAnnuals}
                                touched={true} />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Activos</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                type="text"
                                max="16"
                                placeholder="Ingrese los activos"
                                {...assets}
                                value={assets.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, assets, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Pasivos</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                max="16"
                                type="text"
                                placeholder="Ingrese los pasivos"
                                {...liabilities}
                                value={liabilities.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, liabilities, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Ingresos operacionales mensuales</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                max="16"
                                type="text"
                                placeholder="Ingrese los ingresos operacionales mensuales"
                                {...operatingIncome}
                                value={operatingIncome.value}
                                onBlur={val => this._handleBlurValueNumber(ALLOWS_NEGATIVE_INTEGER, operatingIncome, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Egresos mensuales</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                max="16"
                                type="text"
                                placeholder="Ingrese los egresos mensuales"
                                {...expenses}
                                value={expenses.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, expenses, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Ingresos no operacionales mensuales</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                max="16"
                                type="text"
                                placeholder="Ingrese los ingresos no operacionales mensuales"
                                {...nonOperatingIncome}
                                value={nonOperatingIncome.value}
                                onBlur={val => this._handleBlurValueNumber(ALLOWS_NEGATIVE_INTEGER, nonOperatingIncome, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    
                </Row>
                </div>
        )

    }

}

export function validate(values, props, errors) {

    if (xssValidation(values.annualSales)) {
        errors.annualSales = VALUE_XSS_INVALID;
    } else {
        errors.annualSales = null;
    }


    if (xssValidation(values.dateSalesAnnuals)) {
        errors.dateSalesAnnuals = VALUE_XSS_INVALID;
    } else {
        errors.dateSalesAnnuals = null;
    }

    if (!values.liabilities  && !props.isExclient) {
        errors.liabilities = VALUE_REQUIERED;
    } else if (xssValidation(values.liabilities)) {
        errors.liabilities = VALUE_XSS_INVALID;
    } else {
        errors.liabilities = null;
    }

    if (!values.assets  && !props.isExclient) {
        errors.assets = VALUE_REQUIERED;
    } else if (xssValidation(values.assets)) {
        errors.assets = VALUE_XSS_INVALID;
    } else {
        errors.assets = null;
    }

    if (!values.operatingIncome  && !props.isExclient) {
        errors.operatingIncome = VALUE_REQUIERED;
    } else if (xssValidation(values.operatingIncome)) {
        errors.operatingIncome = VALUE_XSS_INVALID;
    } else {
        errors.operatingIncome = null;
    }

    if (!values.nonOperatingIncome  && !props.isExclient) {
        errors.nonOperatingIncome = VALUE_REQUIERED;
    } else if (xssValidation(values.nonOperatingIncome)) {
        errors.nonOperatingIncome = VALUE_XSS_INVALID;
    } else {
        errors.nonOperatingIncome = null;
    }

    if (!values.expenses  && !props.isExclient) {
        errors.expenses = VALUE_REQUIERED;
    } else if (xssValidation(values.expenses)) {
        errors.expenses = VALUE_XSS_INVALID;
    } else {
        errors.expenses = null;
    }
    
};


export default InfoFinanciera;