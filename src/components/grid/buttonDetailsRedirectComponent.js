import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import {changeOwnerDraft} from '../visit/actions';
import {changeOwnerDraftPrevisit} from '../previsita/actions';
import {changeOwnerDraftPipeline} from '../pipeline/actions';
import {updateTitleNavBar} from '../navBar/actions';
import {updateStatusModal} from '../draftDocuments/actions';

class ButtonDetailsRedirectComponent extends Component {

  constructor(props){
    super(props);
    this._detailVisit = this._detailVisit.bind(this);
  }

  _detailVisit(){
    const {actionsRedirect, updateTitleNavBar, changeOwnerDraft, changeOwnerDraftPrevisit, changeOwnerDraftPipeline, updateStatusModal} = this.props;
    if( actionsRedirect.typeClickDetail === "visita" ){
      updateTitleNavBar("Informe de visita/reunión");
      changeOwnerDraft(actionsRedirect.ownerDraft);
    } else if( actionsRedirect.typeClickDetail === "previsita" ){
      updateTitleNavBar("Informe de previsita");
      changeOwnerDraftPrevisit(actionsRedirect.ownerDraft);
    } else if (actionsRedirect.typeClickDetail === "pipeline") {
      updateTitleNavBar("Informe de pipeline");
      changeOwnerDraftPipeline(actionsRedirect.ownerDraft);
    } else if (actionsRedirect.typeClickDetail === "businessPlan") {
      updateTitleNavBar("Informe de plan de negocio");
      changeOwnerDraftPipeline(actionsRedirect.ownerDraft);
    }
    redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
    updateStatusModal(false);
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
    changeOwnerDraft,
    changeOwnerDraftPrevisit,
    changeOwnerDraftPipeline,
    updateStatusModal
  }, dispatch);
}

function mapStateToProps({navBar, visitReducer}, ownerProps){
  return {
    navBar,
    visitReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDetailsRedirectComponent);
