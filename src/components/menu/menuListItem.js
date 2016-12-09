import React, {Component, PropTypes} from 'react';
import {redirectUrl} from '../globalComponents/actions';
import {toggleMenu} from '../navBar/actions';
import {bindActionCreators} from 'redux';
import {Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';

class MenuListItem extends Component {

    constructor(props){
        super(props);
        this._handleClickMenuItem = this._handleClickMenuItem.bind(this);
    }

  _handleClickMenuItem(){
    const {linkUrl} = this.props;
    if( linkUrl === "/login" ){
      window.localStorage.setItem('sessionToken', '');
    }
    const {toggleMenu} = this.props;
    toggleMenu();
    redirectUrl(linkUrl);
  }

    render() {
        const {iconClassName, labelText, marginTop, colorItem} = this.props;
        return (
            <Col xs={12} md={6} lg={2} style={{padding: '15px 15px 10px 15px'}}>
                <div style={{color: 'white',  backgroundColor: colorItem,  borderColor: colorItem,  borderRadius: '4px 4px 4px 4px', cursor: 'pointer'}}
                     onClick={this._handleClickMenuItem}>
                    <div style={{height: '120px'}}>
                        <Row>
                            <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
                                <i className={iconClassName} style={{fontSize: "50px", marginTop: marginTop, marginLeft: "10px"}}/>
                            </Col>
                            <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
                                <span style={{ fontSize: '18px', marginTop: '5px', lineHeight: '1.1em'}}>
                                    {labelText}
                                </span>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Col>
        );
    }
}

MenuListItem.PropTypes = {
    iconClassName: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired
};

function mapStateToProps({navBar}, ownerProps) {
    return {
        navBar
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleMenu
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuListItem);