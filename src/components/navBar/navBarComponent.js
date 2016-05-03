import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleMenu} from './actions';

class NavBarComponent extends Component {
    constructor(props) {
        super(props);
        this.handleLayoutToggle = this.handleLayoutToggle.bind(this);
    }

    handleLayoutToggle(e) {
        e.preventDefault();
        const {toggleMenu} = this.props;
        toggleMenu();
    }

    render() {
        const pageTitleEl = "";
        return (
            <div className="header-quick-nav" style={{height: "60px", width: "100%"}}>
                <div className="pull-left" style={{paddingLeft: "5px !important"}}>
                    <ul className="nav" style={{paddingLeft: "0px"}}>
                        <li style={{cursor: "pointer"}}>
                            <a onClick={this.handleLayoutToggle}>
                              <i className="big sidebar icon"></i>
                            </a>
                        </li>
                        <li style={{fontSize: "30px"}}>
                            Mis clientes
                        </li>
                    </ul>
                </div>
                <div className="pull-right" style={{paddingRight: "20px", display:"none"}}>
                    <ul className="nav">
                        <li className="quicklinks">
                            <a href="#">
                                <div className="iconset webfont">
                                    <i className="icon-link"></i>
                                    Enlaces rápidos
                                </div>
                            </a>
                        </li>
                        <li className="quicklinks">
                            <a href="#">
                                <div className="iconset webfont">
                                    <i className="icon-search-sm"></i>
                                    Búsqueda
                                </div>
                            </a>
                        </li>
                        <li className="quicklinks">
                            <div className="iconset webfont">
                                <a href="#">
                                    <i className="icon-notification"></i>
                                    Alerta
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleMenu
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(NavBarComponent);
