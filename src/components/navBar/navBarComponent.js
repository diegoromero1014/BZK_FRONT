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
            <div className="header-quick-nav clearfix">
                {/* BEGIN HEADER LEFT SIDE SECTION */}
                <div className="pull-left">
                    {/* BEGIN SLIM NAVIGATION TOGGLE */}
                    <ul className="nav quick-section">
                        <li className="quicklinks">
                            <a onClick={this.handleLayoutToggle} id="layout-condensed-toggle">
                                <i className="icon-menu"></i>
                            </a>
                        </li>
                        {pageTitleEl}
                    </ul>
                    {/* END SLIM NAVIGATION TOGGLE */}
                </div>
                {/* END HEADER LEFT SIDE SECTION */}
                {/* BEGIN HEADER RIGHT SIDE SECTION */}
                <div className="pull-right"></div>
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