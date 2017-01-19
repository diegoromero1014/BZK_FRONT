import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {reset} from 'redux-form';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import moment from 'moment';
import {redirectUrl} from '../globalComponents/actions';
import _ from 'lodash';
import {openModalAlerts} from './actions';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {toggleMenu} from '../navBar/actions';
import {MENU_OPENED} from '../navBar/constants';

var styles = {
    minHeight: "30px",
    height: "30px",
    margin: "0px",
    padding: "7px",
    minWidth: "30px",
    width: "150px"
};

class ItemAlert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            valueYear: "",
            item: ""
        };
        momentLocalizer(moment);
        this._handleRedirectAlert = this._handleRedirectAlert.bind(this);
    }

    _handleRedirectAlert(e) {
        const {openModalAlerts,urlAlert,fnClearFilter,reset,nameForm, menuReducer, toggleMenu, navBar}= this.props;
        openModalAlerts(false);
        redirectUrl(urlAlert);
        reset(nameForm);
        fnClearFilter();
        if( navBar.get('status') === MENU_OPENED ){
            toggleMenu();
        }
    }


    render() {
        const {textValue, icon, styleColor, fontSize, number} = this.props;
        var styleBorderDownload = "1px solid " + styleColor;
        return (
            <Col xs={12} md={6} lg={3} style={{padding: '0 15px 10px 15px'}}>
                <div style={{
                    color: 'white',
                    backgroundColor: styleColor,
                    borderColor: styleColor,
                    borderRadius: '4px 4px 4px 4px',
                    cursor: 'pointer'
                }} onClick={this._handleRedirectAlert}>
                    <div style={{height: '120px'}}>
                        <Row>
                            <Col xs={4} md={4} lg={3}>
                                {icon}
                            </Col>
                            <Col xs={4} md={4} lg={9}>
                                <span style={{
                                    fontSize: '50px',
                                    float: 'right',
                                    marginTop: '22px',
                                    marginRight: "20px"
                                }}>{number}</span>
                                <span
                                    style={{
                                        float: 'right',
                                        marginTop: '16px',
                                        marginRight: '10px',
                                        marginLeft: '39px'
                                    }}>
                          {textValue}
                          </span>
                            </Col>
                        </Row>
                    </div>
                    <div style={{
                        color: 'white', backgroundColor: '#f5f5f5', borderColor: styleColor,
                        borderRadius: '0px 0px 4px 4px', height: '40px', border: styleBorderDownload
                    }}>
                        <span style={{
                            float: 'left',
                            fontSize: '15px',
                            marginTop: '9px',
                            color: styleColor,
                            marginLeft: '10px'

                        }}>Ver detalles</span>
                        <i style={{float: 'right', fontSize: '20px', marginTop: '9px', color: styleColor}}
                           className={"arrow circle right icon"}></i>
                    </div>
                </div>
            </Col>);
    }

}

ItemAlert.propTypes = {
    fnClearFilter: PropTypes.func.isRequired,
    nameForm: PropTypes.string,
    icon: PropTypes.element.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({openModalAlerts, toggleMenu, reset}, dispatch);
}

function mapStateToProps({menuReducer, navBar}, ownerProps) {
    return { menuReducer, navBar};
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemAlert);
