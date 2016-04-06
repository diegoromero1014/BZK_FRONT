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
        const {toggleMenu} = this.props;
        toggleMenu();
        console.log(e, "click");
    }

    render() {
        const pageTitleEl = "";
        return (
            <div className="header-quick-nav" style={{height: "60px"}}>
                {/* BEGIN HEADER LEFT SIDE SECTION */}
                <div className="pull-left">
                    {/* BEGIN SLIM NAVIGATION TOGGLE */}
                    <ul className="nav">
                        <li className="quicklinks">
                            <a onClick={this.handleLayoutToggle} id="layout-condensed-toggle">
                                <i className="icon-menu"></i>
                            </a>
                        </li>
                        <li>
                            {/*pageTitleEl*/}
                            Mis clientes
                        </li>
                    </ul>
                    {/* END SLIM NAVIGATION TOGGLE */}
                </div>
                {/* END HEADER LEFT SIDE SECTION */}
                {/* BEGIN HEADER RIGHT SIDE SECTION */}
                <div className="pull-right">
                    <ul className="nav">
                        <li className="quicklinks">
                            <a href="#">
                                <div className="iconset webfont">
                                    <i className="icon-link"></i>
                                    Enlaces Rápidos
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
                {/* END HEADER RIGHT SIDE SECTION */}
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