import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import {updateTitleNavBar} from '../navBar/actions';

class ButtonDetailsRedirectComponent extends Component {

  constructor(props){
    super(props);
    this._detailVisit = this._detailVisit.bind(this);
  }

  _detailVisit(){
    const {actionsRedirect, updateTitleNavBar} = this.props;
    updateTitleNavBar("Informe de visita/reunión");
    redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
  }

  render(){
    const {actionsRedirect} = this.props;
    return (
      <td><button className="btn btn-primary btn-sm" onClick={this._detailVisit}>
        <i className="zoom icon" style={{margin:'0em', fontSize : '1.2em'}} />
      </button></td>
    );
  }
}

ButtonDetailsRedirectComponent.propTypes = {
  actionsRedirect: PropTypes.object
};

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateTitleNavBar
  }, dispatch);
}

function mapStateToProps({navBar}, ownerProps){
    return {
        navBar
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDetailsRedirectComponent);
