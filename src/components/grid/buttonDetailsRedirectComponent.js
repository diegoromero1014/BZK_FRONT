import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import {changeOwnerDraft} from '../visit/actions';
import {updateTitleNavBar} from '../navBar/actions';

class ButtonDetailsRedirectComponent extends Component {

  constructor(props){
    super(props);
    this._detailVisit = this._detailVisit.bind(this);
  }

  _detailVisit(){
    const {actionsRedirect, updateTitleNavBar, changeOwnerDraft} = this.props;
    updateTitleNavBar("Informe de visita/reunión");
    changeOwnerDraft(actionsRedirect.ownerDraft);
    redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
  }

  render(){
    const {actionsRedirect} = this.props;
    return (
      <td>
        <button className="btn btn-primary btn-sm" onClick={this._detailVisit}>
          <i className="zoom icon" style={{margin:'0em', fontSize : '1.2em'}} />
        </button>
      </td>
    );
  }
}

ButtonDetailsRedirectComponent.propTypes = {
  actionsRedirect: PropTypes.object
};

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateTitleNavBar,
    changeOwnerDraft
  }, dispatch);
}

function mapStateToProps({navBar, visitReducer}, ownerProps){
  return {
    navBar,
    visitReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDetailsRedirectComponent);
